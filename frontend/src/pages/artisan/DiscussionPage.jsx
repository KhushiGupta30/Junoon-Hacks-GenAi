import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { PlusIcon } from "../../components/common/Icons";

const DiscussionPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await api.get("/discussions");
        setDiscussions(response.data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, []);

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/discussions", newDiscussion);
      setDiscussions([response.data, ...discussions]);
      setNewDiscussion({ title: "", content: "" });
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  };

  if (loading) return <div>Loading discussions...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center pt-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Discussions</h1>
        <Link
          to="/artisan/community"
          className="text-google-blue hover:underline"
        >
          Back to Community
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Start a New Discussion</h2>
        <form onSubmit={handleCreateDiscussion}>
          <input
            type="text"
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={newDiscussion.content}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, content: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            rows="3"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-google-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            <PlusIcon className="w-5 h-5 inline-block mr-2" />
            Create Discussion
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Link to={`/artisan/discussions/${discussion._id}`}>
              <h3 className="text-lg font-semibold text-google-blue">
                {discussion.title}
              </h3>
              <p className="text-sm text-gray-600">
                Started by {discussion.author.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionPage;
