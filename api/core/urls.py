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
from evaluations.views import (
    ContentEvaluationViewSet,
    ExternalEvaluationViewSet,
    InternalEvaluationViewSet,
    CertificateViewSet
)
from exams.views import (
    ExamViewSet,
    ExamAttendeeViewSet
)
from organisations.views import (
    OrganisationViewSet
)
from trainings.views import (
    TrainingViewSet,
    TrainingNoteViewSet,
    TrainingCoreViewSet,
    TrainingApplicationViewSet,
    TrainingAttendeeViewSet,
    TrainingAbsenceMemoViewSet,
    TrainingLogViewSet,
    TrainerViewSet,
    TrainingDomainViewSet,
    TrainingTypeViewSet,
    ConfigurationViewSet,
    TrainingNeedAnalysisViewSet,
    MonitoringPlanViewSet,
    BasicLevelViewSet
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
content_evaluations_router = router.register(
    'content-evaluations', ContentEvaluationViewSet
)
external_evaluations_router = router.register(
    'external-evaluations', ExternalEvaluationViewSet
)
internal_evaluations_router = router.register(
    'internal-evaluations', InternalEvaluationViewSet
)
certificates_router = router.register(
    'certificates', CertificateViewSet
)
exams_router = router.register(
    'exams', ExamViewSet
)

exam_attendees_router = router.register(
    'exam-attendees', ExamAttendeeViewSet
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

training_cores_router = router.register(
    'training-cores', TrainingCoreViewSet
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

trainers_router = router.register(
    'trainers', TrainerViewSet
)

training_domains_router = router.register(
    'training-domains', TrainingDomainViewSet
)

training_types_router = router.register(
    'training-types', TrainingTypeViewSet
)

trainning_need_analyses_router = router.register(
    'training-need-analyses', TrainingNeedAnalysisViewSet
)

configurations_router = router.register(
    'configurations', ConfigurationViewSet
)

monitoring_plans_router = router.register(
    'monitoring-plans', MonitoringPlanViewSet
)

basic_levels_router = router.register(
    'basic-levels', BasicLevelViewSet
)

urlpatterns = [
    url(r'v1/', include(router.urls)),
    url(r'auth/', include('rest_auth.urls')),
    url(r'auth/registration/', include('rest_auth.registration.urls')),

    url('auth/obtain/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    url('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    url('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
]