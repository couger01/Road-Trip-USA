# -*- coding: utf-8 -*-
"""
Yelp Fusion API code sample.
This program demonstrates the capability of the Yelp Fusion API
by using the Search API to query for businesses by a search term and location,
and the Business API to query additional information about the top result
from the search query.
Please refer to http://www.yelp.com/developers/v3/documentation for the API
documentation.
This program requires the Python requests library, which you can install via:
`pip install -r requirements.txt`.
Sample usage of the program:
`python sample.py --term="bars" --location="San Francisco, CA"`
"""
from __future__ import print_function
from flask import Flask
import argparse
import json
import pprint
import requests
import sys
import urllib
import os
import base64


# This client code can run on Python 2.x or 3.x.  Your imports can be
# simpler if you only need one of those.
try:
    # For Python 3.0 and later
    from urllib.error import HTTPError
    from urllib.parse import quote
    from urllib.parse import urlencode
except ImportError:
    # Fall back to Python 2's urllib2 and urllib
    from urllib2 import HTTPError
    from urllib import quote
    from urllib import urlencode


# OAuth credential placeholders that must be filled in by users.
# You can find them on
# https://www.yelp.com/developers/v3/manage_app
app = Flask(__name__)
CLIENT_ID = "Xoj9x3TBib-wlvl_qzlDbg"
CLIENT_SECRET = "68RAiFxJDfeWLztuebkKoN4ay41UWuVO8I0OFg7MkT0ZqsWxYbBAXiaVMlez0W4Q"


# API constants, you shouldn't have to change these.
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
BUSINESS_PATH = '/v3/businesses/'  # Business ID will come after slash.
TOKEN_PATH = '/oauth2/token'
GRANT_TYPE = 'client_credentials'


# Defaults for our simple example.
DEFAULT_TERM = 'dinner'
DEFAULT_LOCATION = 'Decorah, IA'
SEARCH_LIMIT = 10

#businessFile = open(os.path.join(os.pardir, "businesses.json"), 'w')





def obtain_bearer_token(host, path):
    """Given a bearer token, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        str: OAuth bearer token, obtained using client_id and client_secret.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    assert CLIENT_ID, "Please supply your client_id."
    assert CLIENT_SECRET, "Please supply your client_secret."
    data = urlencode({
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': GRANT_TYPE,
    })
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }
    response = requests.request('POST', url, data=data, headers=headers)
    bearer_token = response.json()['access_token']
    return bearer_token


def request(businessFile, host, path, bearer_token, url_params=None):
    """Given a bearer token, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        bearer_token (str): OAuth bearer token, obtained using client_id and client_secret.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % bearer_token,
    }

    print(u'Querying {0} ...'.format(url))

    response = requests.request('GET', url, headers=headers, params=url_params)

    #Here is where it should write to the file.

    businessFile.append(response.json())


    return response.json()


def search(bearer_token, term, location, businessFile):
    """Query the Search API by a search term and location.
    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.
    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        'term': term.replace(' ', '+'),
        'location': location.replace(' ', '+'),
        'limit': SEARCH_LIMIT
    }
    return request(businessFile, API_HOST, SEARCH_PATH, bearer_token, url_params=url_params)


def get_business(bearer_token, business_id, businessFile):
    """Query the Business API by a business ID.
    Args:
        business_id (str): The ID of the business to query.
    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return request(businessFile, API_HOST, business_path, bearer_token)


def query_api(term, location, businessFile):
    """Queries the API by the input values from the user.
    Args:
        term (str): The search term to query.
        location (str): The location of the business to query.
    """
    bearer_token = obtain_bearer_token(API_HOST, TOKEN_PATH)

    response = search(bearer_token, term, location, businessFile)

    businesses = response.get('businesses')

    if not businesses:
        print(u'No businesses for {0} in {1} found.'.format(term, location))
        return

    for i in range(10):

        business_id = businesses[i]['id']

        print(u'{0} businesses found, querying business info ' \
            'for the top result "{1}" ...'.format(
                len(businesses), business_id))
        response = get_business(bearer_token, business_id, businessFile)
        


        print(u'Result for business "{0}" found:'.format(business_id))
        pprint.pprint(response, indent=2)

@app.route('/getyelp', methods=['GET'])
def dothething():
    mydict = {}

    businessFile = []


    parser = argparse.ArgumentParser()

    parser.add_argument('-q', '--term', dest='term', default=DEFAULT_TERM,
                        type=str, help='Search term (default: %(default)s)')
    parser.add_argument('-l', '--location', dest='location',
                        default=DEFAULT_LOCATION, type=str,
                        help='Search location (default: %(default)s)')

    input_values = parser.parse_args()

    try:
        query_api("dinner", "Decorah, IA", businessFile)
        #query_api(input_values.term, input_values.location)
    except HTTPError as error:
        sys.exit(
            'Encountered HTTP error {0} on {1}:\n {2}\nAbort program.'.format(
                error.code,
                error.url,
                error.read(),
            )
        )

    for i in range(len(businessFile)):
        json.dumps(businessFile[i])

    print(businessFile)
    mydict["results"] = businessFile
    myJson = json.dumps(mydict)

    #val = json.loads(val)
    return myJson

@app.route('/spotify-api/token',methods=['POST'])
def authorize_token():
    base_secret_client = base64.b64encode('fcadd706105f4f4db8e6c302db211d26:252114775ce44d88b85fc1a34c2c5e06'.encode('utf-8'))
    header = {'Authorization':"Basic {0}".format(base_secret_client.decode())}
    re = requests.post("https://accounts.spotify.com/api/token",data={"grant_type":"client_credentials"},headers=header)
    obj = re.json()
    return json.dumps(obj)

@app.route('/spotify-api/search',methods=['GET'])
def findArtistId():
    arguments = request.url.split('?')[1]
    header = {"Authorization":flask.request.headers.get('Authorization')}
    re = requests.get("https://api.spotify.com/v1/search?{0}".format(arguments),headers=header)
    obj = re.json()
    return json.dumps(obj)

@app.route('/spotify-api/recommendations',methods=['GET'])
def generate_recommendations():
    arguments = request.url.split('?')[1]
    header = {"Authorization":flask.request.headers.get('Authorization')}
    re = requests.get("https://api.spotify.com/v1/recommendations?{0}".format(arguments),headers=header)
    obj = re.json()
    return json.dumps(obj)

if __name__ == '__main__':
    app.run(debug=True)
