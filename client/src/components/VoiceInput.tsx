import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  onListening: (listening: boolean) => void;
}

export function VoiceInput({ onTranscription, onListening }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure recognition
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    // Event handlers
    recognitionInstance.onstart = () => {
      setIsListening(true);
      onListening(true);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event);
      toast({
        title: 'Voice Input Error',
        description: 'There was an error with voice recognition. Please try again.',
        variant: 'destructive',
      });
      setIsListening(false);
      onListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
      onListening(false);
    };
    
    recognitionInstance.onresult = (event) => {
      let transcript = '';
      
      // Get transcript from results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      
      if (transcript.trim()) {
        onTranscription(transcript.trim());
      }
    };
    
    setRecognition(recognitionInstance);
    
    // Clean up on component unmount
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [onTranscription, onListening, toast]);
  
  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: 'Voice Input Error',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        toast({
          title: 'Voice Input Activated',
          description: 'Speak now. Your voice will be transcribed automatically.',
          duration: 3000,
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: 'Voice Input Error',
          description: 'Could not start voice recognition. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <Button
      onClick={toggleListening}
      variant="ghost"
      size="icon"
      className={`rounded-full ${isListening ? 'bg-red-600 text-white hover:bg-red-700' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
}