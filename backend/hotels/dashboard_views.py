from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Count, Sum, F, Value
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.utils.decorators import decorator_from_middleware_with_args
from datetime import timedelta
from .models import Hotel
from users.models import CustomUser
from tickets.models import Ticket
from messaging.models import Message
from emails.models import Email

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Garder l'authentification requise
@cache_page(60 * 5)  # Cache 5 minutes
def dashboard_stats(request):
    """Retourne les statistiques du dashboard"""
    
    # Compter les hôtels
    total_hotels = Hotel.objects.count()
    
    # Compter les utilisateurs
    total_users = CustomUser.objects.count()
    
    # Récupérer les hôtels populaires (les plus chers ou les mieux notés)
    popular_hotels = Hotel.objects.all().order_by('-rating', '-price_per_night')[:5]
    
    popular_hotels_data = [
        {
            'id': hotel.id,
            'name': hotel.name,
            'reservations': int(hotel.available_rooms),  # Utiliser available_rooms comme proxy
        }
        for hotel in popular_hotels
    ]
    
    # Calculer le revenu total à partir des prix des hôtels
    total_revenue = Hotel.objects.aggregate(Sum('price_per_night'))['price_per_night__sum'] or 0
    total_revenue = float(total_revenue) / 1000  # Convertir en K
    
    # Activités récentes basées sur les hôtels créés récemment
    recent_hotels = Hotel.objects.all().order_by('-created_at')[:3]
    recent_activities = [
        {
            'id': idx + 1,
            'type': 'hotel_created',
            'description': f'Hôtel "{hotel.name}" créé',
            'timestamp': hotel.created_at.isoformat(),
        }
        for idx, hotel in enumerate(recent_hotels)
    ]
    
    # Ajouter une activité utilisateur
    recent_activities.append({
        'id': len(recent_activities) + 1,
        'type': 'user_activity',
        'description': f'{total_users} utilisateurs inscrits',
        'timestamp': timezone.now().isoformat(),
    })
    
    # Calculer le nombre total de réservations (nombre de chambres disponibles)
    total_reservations = Hotel.objects.aggregate(Sum('available_rooms'))['available_rooms__sum'] or 0
    
    # Compter les tickets, messages et emails
    total_tickets = Ticket.objects.count()
    total_messages = Message.objects.count()
    total_emails = Email.objects.count()
    
    return Response({
        'totalHotels': total_hotels,
        'totalUsers': total_users,
        'totalReservations': int(total_reservations),
        'totalRevenue': round(total_revenue, 1),
        'totalTickets': total_tickets,
        'totalMessages': total_messages,
        'totalEmails': total_emails,
        'recentActivities': recent_activities,
        'popularHotels': popular_hotels_data,
    })
