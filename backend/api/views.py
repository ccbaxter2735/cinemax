from django.shortcuts import render
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import *
from .serializers import *

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny,]


class CurrentUserView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieListSerializer
    permission_classes = [permissions.AllowAny]


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieDetailSerializer
    permission_classes = [permissions.AllowAny]


class MovieCommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateCommentSerializer
        from .serializers import CommentSerializer
        return CommentSerializer

    def get_queryset(self):
        movie = get_object_or_404(Movie, pk=self.kwargs['movie_id'])
        return movie.comments.all()

    def perform_create(self, serializer):
        movie = get_object_or_404(Movie, pk=self.kwargs['movie_id'])
        serializer.save(user=self.request.user, movie=movie)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, movie_id):
    movie = get_object_or_404(Movie, pk=movie_id)
    user = request.user
    like, created = Like.objects.get_or_create(movie=movie, user=user)
    like.liked = not like.liked if not created else True
    like.save()
    return Response({
        "liked": like.liked,
        "likes_count": movie.likes_count
    })


class MovieRatingCreateUpdateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['movie'] = get_object_or_404(Movie, pk=self.kwargs['movie_id'])
        return context