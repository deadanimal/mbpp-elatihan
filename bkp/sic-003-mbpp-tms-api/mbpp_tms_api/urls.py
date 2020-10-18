
from datetime import datetime, timedelta

from django.conf import settings
from django.conf.urls import include, url
from django.contrib.gis import admin

from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from rest_framework_simplejwt.views import ( TokenObtainPairView,TokenRefreshView,TokenVerifyView)

#############################

from users.views import (
    MyTokenObtainPairView
)

from organisations.views import (
    OrganisationViewSet, 
    OrganisationTypeViewSet
)

from users.views import (
    CustomUserViewSet,
    UserEventViewSet,
    SecurityQuestionViewSet
)

from trainings.views import (
    TrainingViewSet,
    TrainingCodeViewSet, 
    TrainingAttendanceViewSet,
    TrainingApplicationViewSet,
    TrainingAbsenceViewSet,
    TrainingNeedAnswerViewSet,
    TrainingNeedQuestionViewSet,
    TrainingNoteViewSet,
    TrainingAssessmentAnswerViewSet,
    TrainingAssessmentQuestionViewSet,
    TrainingEventViewSet,
    TrainingCodeGroupViewSet,
    TrainingCodeClassViewSet,
    TrainingCodeCategoryViewSet
)

from exams.views import(
    ExamViewSet,
    ExamApplicationViewSet,
    ExamAttendanceViewSet,
    ExamResultViewSet,
    ExamAbsenceViewSet,
    ExamEventViewSet
)

###########################

class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()

users_router = router.register('users', CustomUserViewSet)
user_events_router = router.register('user-events', UserEventViewSet)
security_questions_router = router.register('security-questions', SecurityQuestionViewSet)

organisations_router = router.register('organisations', OrganisationViewSet)
organisation_types_router = router.register('organisation-types', OrganisationTypeViewSet)

trainings_router = router.register('trainings', TrainingViewSet)
trainings_codes_router = router.register('trainings-codes', TrainingCodeViewSet)
training_attendances_router = router.register('training-attendances', TrainingAttendanceViewSet)
training_absences_router = router.register('training-absences',TrainingAbsenceViewSet)
training_applications_router = router.register('training-applications', TrainingApplicationViewSet)
training_need_questions_router = router.register('training-need-questions', TrainingNeedQuestionViewSet)
training_need_answers_router = router.register('training-need-answers', TrainingNeedAnswerViewSet)
training_notes_router = router.register('training-notes',TrainingNoteViewSet)
training_assessment_questions_router = router.register('training-assessment-questions',TrainingAssessmentQuestionViewSet)
training_assessment_answers_router = router.register('training-assessment-answers',TrainingAssessmentAnswerViewSet)
training_events_router = router.register('training-events',TrainingEventViewSet)
training_code_group_router = router.register('training-code-groups',TrainingCodeGroupViewSet)
training_code_class_router = router.register('training-code-class',TrainingCodeClassViewSet)
training_code_category_router = router.register('training-code-categories',TrainingCodeCategoryViewSet)

exams_routers = router.register('exams', ExamViewSet)
exam_applications_router = router.register('exam-applications',ExamApplicationViewSet)
exam_attendances_router = router.register('exam-attendances', ExamAttendanceViewSet)
exam_results_router = router.register('exam-results', ExamResultViewSet)
exam_absences_router = router.register('exam-absences', ExamAbsenceViewSet)
exam_events_router = router.register('exam-events', ExamEventViewSet)

urlpatterns = [

    url(r'v1/', include(router.urls)),
    url(r'auth/', include('rest_auth.urls')),
    url(r'auth/registration/', include('rest_auth.registration.urls')),

    url('auth/obtain/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    url('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    url('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),

]