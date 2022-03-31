from django.db import models

from . import utils
from .group_member import GroupMember
from .conversation import Conversation


class Group(utils.CustomModel):

    groupName = models.TextField(blank=False, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    groupMembers = models.ForeignKey(
        GroupMember,
        on_delete=models.CASCADE,
        db_column="groupMembers",
    )
    groupConversation = models.OneToOneField(
        Conversation,
        on_delete=models.CASCADE,
        db_column="groupConvo"
    )

