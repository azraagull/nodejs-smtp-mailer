import React, { useState } from 'react';

function App() {
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderEmail,
          receiverEmail,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('E-posta gönderme hatası');
      }

      const data = await response.json();
      setResponse('E-posta başarıyla gönderildi!');
    } catch (error) {
      console.error('E-posta gönderme hatası: ', error);
      setResponse('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">
              Gönderen E-posta
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="senderEmail"
                id="senderEmail"
                autoComplete="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700">
            Alıcı E-posta
          </label>
          <input
            type="email"
            name="receiverEmail"
            id="receiverEmail"
            autoComplete="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="mt-1 p-2 w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Konu
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            autoComplete="off"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 p-2 w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            İçerik
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 p-2 w-full block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Gönder
        </button>
      </div>

      {response && <p className="mt-4 text-sm text-gray-700">{response}</p>}
    </form>
  );
}

export default App;
