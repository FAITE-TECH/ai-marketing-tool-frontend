import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import axios from 'axios';

const ContentEditor = () => {
  const [tone, setTone] = useState('professional');
  const [additionalContext, setAdditionalContext] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [industry, setIndustry] = useState('healthcare');
  const [keywords, setKeywords] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [history, setHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login');
    }
  }, [navigate, token]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount.configure({
        limit: 5000,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setWordCount(editor.storage.characterCount.words());
      setCharCount(editor.storage.characterCount.characters());
    },
  });

  const handleGenerateAI = async () => {
    if (isGenerating) return;
    setError('');
    setIsGenerating(true);

    const payload = {
      additional_context: additionalContext,
      content_type: contentType,
      industry,
      keywords,
      tone,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/content/generate',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const generated = response.data.content?.trim() || '';
      if (editor) {
        editor.commands.focus();
        editor.commands.insertContent(generated);
        // Update counts after insertion
        setWordCount(editor.storage.characterCount.words());
        setCharCount(editor.storage.characterCount.characters());
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      setError('Content generation failed. Try again.');
      if (axios.isAxiosError(error) && error.response?.status === 401) navigate('/login');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();

    if (!htmlContent || htmlContent === '<p></p>') {
      setError('Content is empty. Please generate or enter content before saving.');
      return;
    }

    setIsSaving(true);
    setError('');

    const payload = {
      content: htmlContent,
      tone,
      word_count: wordCount,
      character_count: charCount,
      ...(scheduledDate ? { scheduled_date: scheduledDate } : {}),
      additional_context: additionalContext,
      content_type: contentType,
      industry,
      keywords,
    };

    try {
      await axios.post('http://localhost:8000/api/v1/content/save', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (editingIndex !== null) {
        const updated = [...history];
        updated[editingIndex] = payload;
        setHistory(updated);
        setEditingIndex(null);
      } else {
        setHistory([...history, payload]);
      }

      editor.commands.clearContent();
      setScheduledDate('');
      setWordCount(0);
      setCharCount(0);
    } catch (error) {
      console.error('Saving content failed:', error.response?.data || error.message);
      setError(
        'Saving content failed: ' + (error.response?.data?.message || 'Unknown error')
      );
      if (axios.isAxiosError(error) && error.response?.status === 401) navigate('/login');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (index) => {
    const item = history[index];
    if (editor) {
      editor.commands.setContent(item.content);
      setWordCount(item.word_count);
      setCharCount(item.character_count);
    }
    setScheduledDate(item.scheduled_date || '');
    setTone(item.tone);
    setAdditionalContext(item.additional_context || '');
    setContentType(item.content_type || 'blog');
    setIndustry(item.industry || '');
    setKeywords(item.keywords || '');
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setHistory(history.filter((_, i) => i !== index));
    if (editingIndex === index) {
      editor?.commands.clearContent();
      setEditingIndex(null);
      setScheduledDate('');
      setWordCount(0);
      setCharCount(0);
    }
  };

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Editor</h1>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Tone/Style</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
            <option value="conversational">Conversational</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="informative">Informative</option>
            <option value="persuasive">Persuasive</option>
            <option value="formal">Formal</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="blog">Blog</option>
            <option value="email">Email</option>
            <option value="social_media">Social Media</option>
            <option value="ad_copy">Ad Copy</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., healthcare, finance, tech..."
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., AI, automation, GPT..."
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Additional Context</label>
          <input
            type="text"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., Focus on trends, explain to beginners"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Scheduled Date</label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <div className="relative border rounded mb-4 bg-white shadow min-h-[200px]">
  {/* Placeholder */}
  {editor && editor.isEmpty && (
    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
      The content will appear here...
    </div>
  )}

  <EditorContent editor={editor} className="p-4" />
</div>


      <div className="flex gap-4 mb-4">
        <button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className={`text-white px-4 py-2 rounded ${
            isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`text-white px-4 py-2 rounded ${
            isSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingIndex !== null
            ? isSaving
              ? 'Updating...'
              : 'Update Content'
            : isSaving
            ? 'Saving...'
            : 'Save Content'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="text-gray-500 text-sm mb-8">
        Words: {wordCount} | Characters: {charCount}
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Saved Content</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2">Preview</th>
                <th className="border p-2">Scheduled Date</th>
                <th className="border p-2">Tone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td
                    className="border p-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        stripHtml(item.content).substring(0, 50) +
                        (item.content.length > 50 ? '...' : ''),
                    }}
                  />
                  <td className="border p-2">
                    {item.scheduled_date
                      ? new Date(item.scheduled_date).toLocaleDateString()
                      : ''}
                  </td>
                  <td className="border p-2">{item.tone}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;