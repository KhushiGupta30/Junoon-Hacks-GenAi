const express = require("express");
const { body, validationResult } = require("express-validator");
const OrderService = require("../services/OrderService");
const ProductService = require("../services/ProductService");
const UserService = require("../services/UserService");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  [auth, authorize("buyer")],
  [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Order must contain at least one item"),
    body("items.*.product").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("shippingAddress.name")
      .notEmpty()
      .withMessage("Shipping name is required"),
    body("shippingAddress.addressLine1")
      .notEmpty()
      .withMessage("Shipping address is required"),
    body("shippingAddress.city")
      .notEmpty()
      .withMessage("Shipping city is required"),
    body("payment.method")
      .isIn([
        "credit_card",
        "debit_card",
        "paypal",
        "bank_transfer",
        "cash_on_delivery",
      ])
      .withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, shippingAddress, billingAddress, payment } = req.body;

      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await ProductService.findById(item.product);
        if (!product) {
          return res
            .status(400)
            .json({ message: `Product ${item.product} not found` });
        }

        if (product.status !== "active") {
          return res
            .status(400)
            .json({ message: `Product ${product.name} is not available` });
        }

        if (
          product.inventory.quantity < item.quantity &&
          !product.inventory.isUnlimited
        ) {
          return res.status(400).json({
            message: `Insufficient inventory for ${product.name}. Available: ${product.inventory.quantity}`,
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product.id,
          artisan: product.artisan,
          quantity: item.quantity,
          priceAtTime: product.price,
          customization: item.customization || {},
        });

        if (!product.inventory.isUnlimited) {
          await ProductService.reserveInventory(product.id, item.quantity);
        }
      }

      const tax = subtotal * 0.08;
      const shipping = subtotal > 100 ? 0 : 15;
      const total = subtotal + tax + shipping;

      const orderData = {
        buyer: req.user.id,
        items: orderItems,
        pricing: {
          subtotal,
          tax,
          shipping,
          total,
        },
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        payment,
      };
      const artisan = await UserService.findById(orderItems[0].artisan); // Assuming one artisan per order for simplicity
      const originCity = artisan.profile.location.city;
      const destinationCity = shippingAddress.city;

      const originCoords = cityCoordinates[originCity];
      const destinationCoords = cityCoordinates[destinationCity];

      let distanceKm = 0;
      let durationHours = 0;

      if (originCoords && destinationCoords) {
          // 2. Call Google Distance Matrix API
          const apiKey = process.env.GOOGLE_MAPS_API_KEY;
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.lat},${originCoords.lon}&destinations=${destinationCoords.lat},${destinationCoords.lon}&key=${apiKey}`;
          
          try {
              const response = await fetch(url);
              const data = await response.json();
              if (data.rows[0].elements[0].status === "OK") {
                  distanceKm = data.rows[0].elements[0].distance.value / 1000; // Convert meters to km
                  durationHours = data.rows[0].elements[0].duration.value / 3600; // Convert seconds to hours
              }
          } catch (apiError) {
              console.error("Distance Matrix API call failed:", apiError);
              // Continue without this data, or handle error appropriately
          }
      }

      // 3. Estimate Package Weight (You should make this more accurate)
      let totalWeightKg = 0;
      for (const item of orderItems) {
          // In the future, get this from ProductService: product.weightKg
          totalWeightKg += (item.quantity * 0.5); // Assuming each item is 0.5 kg for now
      }

      // 4. Add logistics data to the order
      orderData.logistics = {
          originCity,
          destinationCity,
          distanceKm: Math.round(distanceKm),
          estimatedDurationHours: Math.round(durationHours),
          packageWeightKg: totalWeightKg,
          recommendations: [] // Will be populated later by the hub
      };
      const order = await OrderService.create(orderData);

      // Populate product and artisan data
      const populatedOrder = {
        ...order,
        items: await Promise.all(
          order.items.map(async (item) => {
            const product = await ProductService.findById(item.product);
            const artisan = await UserService.findById(item.artisan);
            return {
              ...item,
              product: product
                ? {
                    id: product.id,
                    name: product.name,
                    images: product.images,
                  }
                : null,
              artisan: artisan
                ? {
                    id: artisan.id,
                    name: artisan.name,
                    profile: artisan.profile,
                  }
                : null,
            };
          })
        ),
      };

      res.status(201).json({
        message: "Order created successfully",
        order: populatedOrder,
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error while creating order" });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filter = {};
    if (req.user.role === "buyer") {
      filter.buyer = req.user.id;
    } else if (req.user.role === "artisan") {
      filter["items.artisan"] = req.user.id;
    }

    if (status) filter.status = status;

    const options = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    const orders = await OrderService.findMany(filter, options);

    // Populate buyer and item data
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const buyer = await UserService.findById(order.buyer);
        const populatedItems = await Promise.all(
          order.items.map(async (item) => {
            const product = await ProductService.findById(item.product);
            const artisan = await UserService.findById(item.artisan);
            return {
              ...item,
              product: product
                ? {
                    id: product.id,
                    name: product.name,
                    images: product.images,
                  }
                : null,
              artisan: artisan
                ? {
                    id: artisan.id,
                    name: artisan.name,
                    profile: artisan.profile,
                  }
                : null,
            };
          })
        );

        return {
          ...order,
          buyer: buyer
            ? {
                id: buyer.id,
                name: buyer.name,
                profile: buyer.profile,
              }
            : null,
          items: populatedItems,
        };
      })
    );

    const total = await OrderService.count(filter);

    res.json({
      orders: populatedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await OrderService.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const hasAccess =
      order.buyer === req.user.id ||
      order.items.some((item) => item.artisan === req.user.id) ||
      req.user.role === "admin";

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Populate buyer and item data
    const buyer = await UserService.findById(order.buyer);
    const populatedItems = await Promise.all(
      order.items.map(async (item) => {
        const product = await ProductService.findById(item.product);
        const artisan = await UserService.findById(item.artisan);
        return {
          ...item,
          product: product || null,
          artisan: artisan
            ? {
                id: artisan.id,
                name: artisan.name,
                profile: artisan.profile,
              }
            : null,
        };
      })
    );

    const populatedOrder = {
      ...order,
      buyer: buyer
        ? {
            id: buyer.id,
            name: buyer.name,
            email: buyer.email,
            profile: buyer.profile,
          }
        : null,
      items: populatedItems,
    };

    res.json(populatedOrder);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error while fetching order" });
  }
});

router.put(
  "/:id/status",
  auth,
  [
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .withMessage("Invalid status"),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes must be under 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await OrderService.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const isArtisan =
        req.user.role === "artisan" &&
        order.items.some((item) => item.artisan === req.user.id);
      const isAdmin = req.user.role === "admin";

      if (!isArtisan && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { status, notes } = req.body;

      const updatedOrder = await OrderService.updateStatus(
        req.params.id,
        status,
        notes,
        req.user.id
      );

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Server error while updating order" });
    }
  }
);

module.exports = router;
