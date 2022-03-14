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

            sender_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            text = body.get("text")
            recipient_id = body.get("recipientId")
            sender = body.get("sender")

            if conversation_id:
                other_user_messages = Message.objects.filter(conversation_id=conversation_id, senderId=recipient_id).order_by('-createdAt')
                most_recent = other_user_messages[0]
                if not most_recent.readStatus:
                    last_unread = other_user_messages.filter(readStatus=True)[0]
                    print(last_unread.to_dict(), most_recent.to_dict())
                    most_recent.readStatus = True
                    last_unread.readStatus = False
                    most_recent.save()
                    last_unread.save()

                return JsonResponse({"message": most_recent.to_dict()})

            return JsonResponse({"message": "Response"})

        except Exception as e:
            print(e)
            return HttpResponse(content={"error": e}, status=500)
