import { useState } from "react";
import axios from "axios";

import ChatBot from "react-chatbotify";

interface FormState {
    userName?: string; 
    topic?: string;
    response?: string;
    avatar_video_url?: string;
}

const Chatbot = () => {
const [form, setForm] = useState<FormState>({});

  const flow = {
    start: {
      message: "Hello there! What is your name?",
      function: (params: { userInput: string }) => setForm({ ...form, userName: params.userInput }),
      path: "default_topics",
    },
    default_topics: {
        message: `Hi ${form.userName}, Please choose a topic:`,
        options: [
          "Emerging Technology",
          "Today's news",
          "Top 5 Personal finance advice",
          "Random fun facts",
        ],
        function: async (params: { userInput: string }) => {
          const defaultTopics = [
            "Emerging Technology",
            "Today's news",
            "Top 5 Personal finance advice",
            "Random fun facts"
          ];
          
          const selectedTopic = defaultTopics.includes(params.userInput)
            ? params.userInput 
            : params.userInput; 
          
       
          setForm({ ...form, topic: selectedTopic });
      
          try {
            const res = await axios.post("https://enligence-chatbot.onrender.com/api/chat", { userInput: selectedTopic });
            console.log(res);
            setForm({ ...form, response: res.data }); 
            
            // try {
            //  const apiKey = 'YOUR_DID_API_KEY';
            //  const avatarId = 'YOUR_AVATAR_ID'; 

            //  const avatar_response = await axios.post(
            //     'https://api.d-id.com/v1/talks', 
            //     {
            //       script: {
            //         type: 'text',
            //         input: form.response, 
            //       },
            //       avatar_id: avatarId, 
            //     },
            //     {
            //       headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${apiKey}`, 
            //       },
            //     }
            //   );
              
            //   setForm({...form, avatar_video_url : avatar_response.data.result_url})
            // } catch (error) {
            //    console.error('Error generating video:', error);
            // }
          } catch (error) {
            setForm({ ...form, response: `Sorry! Error in fetching response ${error}` });
          }
        },
        path: "print_response",
      },
      print_response: {
      message: form.response,
      path: "start",
    },
    end: {
      message: "Thank you!",
      path: "start",
    },
  };

  const settings = {
    isOpen: false,
    general: {
      primaryColor: "#42b0c5",
      secondaryColor: "#491d8d",
      fontFamily: "Arial, sans-serif",
    },
    audio: {
      disabled: false,
    },
    voice: { disabled: false },
  };

  return (
    <>
      <ChatBot flow={flow} settings={settings} />
    </>
  );
};

export default Chatbot;
