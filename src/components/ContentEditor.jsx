import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const ContentEditor = () => {
  const [tone, setTone] = useState('professional');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount.configure({ limit: 1000 }),
    ],
    content: '',
  });

  const handleGenerateAI = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          prompt: `Write a ${tone} marketing message:`,
          model: 'text-davinci-003',
          max_tokens: 100,
        },
        {
          headers: { Authorization: `Bearer YOUR_OPENAI_API_KEY` },
        }
      );
      editor.chain().focus().insertContent(response.data.choices[0].text.trim()).run();
    } catch (error) {
      console.error('AI generation failed:', error);
    }
  };

  const handleSave = () => {
    const htmlContent = editor.getHTML();
    if (editingIndex !== null) {
      const updated = [...history];
      updated[editingIndex] = { content: htmlContent, scheduledDate, tone };
      setHistory(updated);
      setEditingIndex(null);
    } else {
      setHistory([...history, { content: htmlContent, scheduledDate, tone }]);
    }
    editor.commands.clearContent();
    setScheduledDate(null);
  };

  const handleEdit = (index) => {
    const item = history[index];
    editor.commands.setContent(item.content);
    setScheduledDate(item.scheduledDate);
    setTone(item.tone);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Editor</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Tone/Style</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Schedule Date</label>
        <DatePicker
          selected={scheduledDate}
          onChange={(date) => setScheduledDate(date)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="border rounded mb-4">
        <EditorContent editor={editor} className="min-h-[200px] p-4" />
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleGenerateAI}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate with AI
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingIndex !== null ? 'Update Content' : 'Save Content'}
        </button>
      </div>

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
                      __html: item.content.substring(0, 50) + '...',
                    }}
                  />
                  <td className="border p-2">
                    {item.scheduledDate?.toLocaleDateString()}
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
