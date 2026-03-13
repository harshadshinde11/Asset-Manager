import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetChatHistory, 
  useSendChatMessage, 
  useClearChatHistory,
  getGetChatHistoryQueryKey
} from "@workspace/api-client-react";

export function useChatSession(sessionId: string = "default") {
  const queryClient = useQueryClient();
  
  const historyQuery = useGetChatHistory({ session_id: sessionId });
  
  const sendMessage = useSendChatMessage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetChatHistoryQueryKey({ session_id: sessionId }) });
      }
    }
  });
  
  const clearHistory = useClearChatHistory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetChatHistoryQueryKey({ session_id: sessionId }) });
      }
    }
  });

  return {
    messages: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    isSending: sendMessage.isPending,
    isClearing: clearHistory.isPending,
    send: (message: string, language: string = "en") => 
      sendMessage.mutate({ data: { message, session_id: sessionId, language } }),
    clear: () => clearHistory.mutate({ params: { session_id: sessionId } })
  };
}
