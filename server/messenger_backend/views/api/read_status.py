from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Message, Conversation
from rest_framework.views import APIView


class ReadStatus(APIView):

    def put(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            conversation_id = request.data.get("conversationId")
            sender_id = request.data.get("senderId")


            # Requires a conversation ID. If there is none, there's nothing to mark as "read"
            if conversation_id:
                conversation = Conversation.objects.filter(id=conversation_id).first()
                if conversation.user1_id != sender_id and conversation.user2_id != sender_id:
                    return HttpResponse(status=403)
                else:
                    user_messages = Message.objects.filter(conversation_id=conversation_id)
                    most_recent = user_messages.last()
                    if most_recent and not most_recent.isRead:
                        last_unread = user_messages.filter(isRead=True).last()
                        if last_unread and last_unread.id != most_recent.id:
                            last_unread.isRead = False
                            last_unread.save()
                        most_recent.isRead = True
                        most_recent.save()
                    return JsonResponse({"message": most_recent.to_dict() if most_recent else ""})
            else:
                return HttpResponse(status=204)

        except Exception as e:
            print(e)
            return HttpResponse(content={"error": e}, status=500)
