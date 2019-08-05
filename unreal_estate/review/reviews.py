from .models import Rating
from advertising.models import Property
from booking.models import Booking
from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import json
from django.views.decorators.csrf import csrf_exempt
import logging
@csrf_exempt
def RatingFunction (request, property_id):
    print(property_id)
    ratings = Rating.objects.filter(property_id=property_id).values()
    return JsonResponse({'results': list(ratings)})


# Get an instance of a logger
debugLogger = logging.getLogger('debugLogger')
logger = logging.getLogger(__name__)
@csrf_exempt
def SubmitReview(request):

    # POST
    if (request.method == "POST"):
        debugLogger.debug("Create new review")
        if not (request.user.is_authenticated):
            debugLogger.info("the user is not logged in")
            responce = JsonResponse({'error': "User is not logged in."})
            responce.status_code = 403
            return responce


        # print("post: " + request.body.decode('utf-8'))
        # print("user: " + str(request.user.id))
        json_data = json.loads(request.body.decode('utf-8'))

        propertyInstance = Property.objects.get(property_id=json_data['property_id'])
        bookingInstance = Booking.objects.get(booking_id=json_data['booking_id'])
        reviewDetails = {
            'user_id':     request.user,
            'property_id': propertyInstance,
            'booking_id':  bookingInstance,
            'value':       json_data['value'],
            'notes':       json_data['notes'],
        }

    # Data Validation
    if not (
        reviewDetails['user_id'] and \
        reviewDetails['property_id'] and \
        reviewDetails['booking_id'] and \
        reviewDetails['value'] and \
        reviewDetails['notes']):
        response = JsonResponse({'error': 'Required parameters not met.'})
        response.status_code = 400
        return response
    review = Rating()
    review.user_id = reviewDetails['user_id']
    review.property_id = reviewDetails['property_id']
    review.booking_id = reviewDetails['booking_id']
    review.value = reviewDetails['value']
    review.notes = reviewDetails['notes']
    # Save new review 
    try:
        review.save()
    except IntegrityError as ex:
        if (ex.__cause__.pgcode == '23505'):
            response = JsonResponse({'error': 'duplicate entry'})
            response.status_code = 400
            return response
    response = JsonResponse({'review':review.rating_id}) # return booking id to test
    return response

@csrf_exempt
def ReviewDetailsBID(request, booking_id):
    # GET
    if (request.method == "GET"):
        debugLogger.debug("Get booking details BID")
        # Retrieve old booking
        try:
            review = Rating.objects.filter(booking_id=booking_id)[:1].get()
        except ObjectDoesNotExist:
            response = JsonResponse({'error': 'rating does not exist'})
            response.status_code = 403
            return response
        reviewDetails = {
            'rating_id'     : review.rating_id,
            'property_id'   : review.property_id.property_id,
            'user_id'       : review.user_id.id,
            'booking_id'    : booking_id,
            'value'         : review.value,
            'date'          : review.date,
            'notes'         : review.notes,
        }
        # print(reviewDetails['rating_id'])
        # print(reviewDetails['property_id'])
        # print(reviewDetails['user_id'])
        # print(reviewDetails['booking_id'])
        # print(reviewDetails['value'])
        # print(reviewDetails['date'])
        # print(reviewDetails['notes'])
        return JsonResponse(reviewDetails)