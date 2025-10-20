import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { ChatAlt2Icon } from '../../components/common/Icons';

const DiscussionThreadPage = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await api.get(`/discussions/${id}`);
        setDiscussion(response.data);
      } catch (error) {
        console.error("Error fetching discussion:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [id]);

  const handleAddReply = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/discussions/${id}/replies`, { content: newReply });
      setDiscussion({ ...discussion, replies: [...discussion.replies, response.data] });
      setNewReply('');
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  if (loading) return <div>Loading discussion...</div>;
  if (!discussion) return <div>Discussion not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/artisan/discussions" className="text-google-blue hover:underline mb-4 pt-8 inline-block">
        &larr; Back to all discussions
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{discussion.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Started by {discussion.author.name}
        </p>
        <p className="text-gray-700 mb-6">{discussion.content}</p>

        <h2 className="text-xl font-semibold mb-4">Replies</h2>
        <div className="space-y-4 mb-6">
          {discussion.replies.map(reply => (
            <div key={reply._id} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800">{reply.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                - {reply.author.name}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddReply}>
          <textarea
            placeholder="Add your reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows="3"
            required
          ></textarea>
          <button type="submit" className="bg-google-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
            Add Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionThreadPage;