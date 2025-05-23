import React, { useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const CampaignSchedulerPage = () => {
  const [campaignName, setCampaignName] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState('17:00');
  const [audience, setAudience] = useState('general');
  const [budget, setBudget] = useState(1000);
  const [campaigns, setCampaigns] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const initialConfig = {
    namespace: 'CampaignEditor',
    theme: {},
    onError: (error) => console.error(error),
  };

  const handleSave = () => {
    const campaignData = {
      name: campaignName,
      content: editorContent,
      startDate,
      startTime,
      endDate,
      endTime,
      audience,
      budget,
      status: 'scheduled',
    };

    if (editingIndex !== null) {
      const updated = [...campaigns];
      updated[editingIndex] = campaignData;
      setCampaigns(updated);
      setEditingIndex(null);
    } else {
      setCampaigns([...campaigns, campaignData]);
    }

    setCampaignName('');
    setEditorContent('');
    setStartDate(new Date());
    setStartTime('09:00');
    setEndDate(new Date());
    setEndTime('17:00');
    setAudience('general');
    setBudget(1000);
  };

  const handleEdit = (index) => {
    const data = campaigns[index];
    setCampaignName(data.name);
    setEditorContent(data.content);
    setStartDate(data.startDate);
    setStartTime(data.startTime);
    setEndDate(data.endDate);
    setEndTime(data.endTime);
    setAudience(data.audience);
    setBudget(data.budget);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...campaigns];
    updated.splice(index, 1);
    setCampaigns(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">📅 Campaign Scheduler</h1>

      <div className="grid gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        {/* Campaign Name */}
        <div>
          <label className="block font-semibold mb-1">Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block font-semibold mb-1">Campaign Content:</label>
          <div className="border rounded-xl bg-white dark:bg-gray-900 p-3 shadow-inner">
            <LexicalComposer initialConfig={initialConfig}>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-[150px] p-2 outline-none bg-white dark:bg-gray-900" />
                }
                placeholder={<div className="text-gray-400">Write campaign content...</div>}
              />
              <HistoryPlugin />
              <OnChangePlugin
                onChange={(editorState) => {
                  editorState.read(() => {
                    const textContent = editorState.toJSON().root.children
                      .map((node) => node.text || '')
                      .join('\n');
                    setEditorContent(textContent);
                  });
                }}
              />
            </LexicalComposer>
          </div>
        </div>

        {/* Schedule Pickers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Date & Time:</label>
            <DayPicker selected={startDate} onSelect={setStartDate} />
            <TimePicker
              value={startTime}
              onChange={setStartTime}
              className="mt-2 w-full rounded border border-gray-300 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date & Time:</label>
            <DayPicker selected={endDate} onSelect={setEndDate} />
            <TimePicker
              value={endTime}
              onChange={setEndTime}
              className="mt-2 w-full rounded border border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Audience Selector */}
        <div>
          <label className="block font-semibold mb-1">Target Audience:</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <option value="general">General</option>
            <option value="subscribers">Subscribers</option>
            <option value="new-customers">New Customers</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block font-semibold mb-1">Budget ($):</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition"
        >
          {editingIndex !== null ? 'Update Campaign' : 'Save Campaign'}
        </button>
      </div>

      {/* Scheduled Campaigns Preview */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">📋 Scheduled Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No campaigns scheduled.</p>
        ) : (
          campaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 mb-4 shadow"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">{campaign.name}</h3>
                  <p className="text-sm whitespace-pre-wrap mt-1">{campaign.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    🕐 {campaign.startDate.toDateString()} {campaign.startTime} —{' '}
                    {campaign.endDate.toDateString()} {campaign.endTime}
                  </p>
                  <p className="text-xs text-gray-500">🎯 Audience: {campaign.audience}</p>
                  <p className="text-xs text-gray-500">💰 Budget: ${campaign.budget}</p>
                  <p className="text-xs text-green-600">Status: {campaign.status}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 border border-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignSchedulerPage;
