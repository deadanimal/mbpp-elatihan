from datetime import datetime, timedelta

from django.conf import settings
from django.conf.urls import include, url
from django.contrib.gis import admin

from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from users.views import (
    MyTokenObtainPairView
)
from users.views import (
    CustomUserViewSet,
    UserLogViewSet,
    SecurityQuestionViewSet,
    SecurityAnswerViewSet
)
from exams.views import (
    ExamViewSet
)
from organisations.views import (
    OrganisationViewSet
)
from trainings.views import (
    TrainingViewSet,
    TrainingNoteViewSet,
    TrainingCodeViewSet,
    TrainingApplicationViewSet,
    TrainingAttendeeViewSet,
    TrainingAbsenceMemoViewSet,
    TrainingLogViewSet
)

class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()

users_router = router.register(
    'users', CustomUserViewSet
)

security_questions_router = router.register(
    'security-questions', SecurityQuestionViewSet
)

security_answers_router = router.register(
    'security-answers', SecurityAnswerViewSet
)
# user_logs_router = router.register(
#     'user-logs', UserLogViewSet
# )

exams_router = router.register(
    'exams', ExamViewSet
)

organisations_router = router.register(
    'organisations', OrganisationViewSet
)

trainings_router = router.register(
    'trainings', TrainingViewSet
)

training_notes_router = router.register(
    'training-notes', TrainingNoteViewSet
)

training_codes_router = router.register(
    'training-codes', TrainingCodeViewSet
)

training_applications_router = router.register(
    'training-applications', TrainingApplicationViewSet
)

training_attendees_router = router.register(
    'training-attendees', TrainingAttendeeViewSet
)

training_absences_router = router.register(
    'training-absences', TrainingAbsenceMemoViewSet
)

training_logs_router = router.register(
    'training-logs', TrainingLogViewSet
)

urlpatterns = [
    url(r'v1/', include(router.urls)),
    url(r'auth/', include('rest_auth.urls')),
    url(r'auth/registration/', include('rest_auth.registration.urls')),

    url('auth/obtain/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    url('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    url('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
]