from django.db import models
from django.db.models import Q

from . import utils
from .user import User
from .group import Group


class GroupMember(utils.CustomModel):

    groupId = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        db_column="groupId",
    )
    member = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        db_column="groupMember",
    )
    addedAt = models.DateTimeField(auto_now_add=True, db_index=True)



