from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from rest_framework.views import APIView


class MarkRead(APIView):

    def post(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            body = request.data
            conversation_id = body.get("conversationId")
            recipient_id = body.get("recipientId")

            # Requires a conversation ID. If there is none, there's nothing to mark as "read"
            if conversation_id:
                other_user_messages = Message.objects.filter(conversation_id=conversation_id, senderId=recipient_id)
                most_recent = other_user_messages.last()
                if not most_recent.readStatus:
                    last_unread = other_user_messages.filter(readStatus=True).last()
                    most_recent.readStatus, last_unread.readStatus = True, False
                    most_recent.save()
                    last_unread.save()

                return JsonResponse({"message": most_recent.to_dict()})
            else:
                return

        except Exception as e:
            print(e)
            return HttpResponse(content={"error": e}, status=500)
