import React, { useState, useEffect } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  text: string;
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    // Don't attempt to speak if already speaking or if no text
    if (isSpeaking || !text.trim()) return;
    
    // Make sure speech synthesis is available
    if (!window.speechSynthesis) {
      toast({
        title: "Error",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Detect language for proper voice selection (using regex patterns for basic detection)
      const containsDevanagari = /[\u0900-\u097F]/.test(text); // Hindi and other Devanagari script
      const containsChinese = /[\u4e00-\u9fff]/.test(text);
      const containsJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Some browsers need a small delay to load voices
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          selectAndSpeak(utterance, voices);
        }, 100);
      } else {
        selectAndSpeak(utterance, voices);
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Text-to-Speech Error",
        description: "Failed to generate speech",
        variant: "destructive",
        duration: 3000,
      });
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };
  
  const selectAndSpeak = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    // Detect language and select appropriate voice
    const containsDevanagari = /[\u0900-\u097F]/.test(text); // Hindi and other Devanagari script
    const containsChinese = /[\u4e00-\u9fff]/.test(text);
    const containsJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
    
    console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
    
    // Select the appropriate voice based on language detection
    let selectedVoice = null;
    
    if (containsDevanagari) {
      // Look for Hindi voice specifically
      selectedVoice = voices.find(voice => 
        voice.lang.includes('hi-IN') || voice.lang.includes('hi') || voice.name.includes('Hindi')
      );
      utterance.lang = 'hi-IN';
    } else if (containsChinese) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('zh') || voice.name.includes('Chinese')
      );
      utterance.lang = 'zh-CN';
    } else if (containsJapanese) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('ja') || voice.name.includes('Japanese')
      );
      utterance.lang = 'ja-JP';
    } else {
      // Default to English
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en-US') || voice.lang.includes('en-GB')
      );
      utterance.lang = 'en-US';
    }
    
    // If we found a matching voice, use it
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    } else {
      console.log("No suitable voice found, using default voice");
    }
    
    // Set up event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsLoading(false);
      toast({
        title: "Text-to-Speech Error",
        description: "An error occurred during speech playback",
        variant: "destructive",
        duration: 3000,
      });
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={isSpeaking ? stopSpeaking : speak}
            className={`h-8 w-8 rounded-full ${
              isSpeaking 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{isSpeaking ? 'Stop speaking' : 'Read aloud'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}