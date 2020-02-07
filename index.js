const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-b43c5-firebase-adminsdk-rp6wp-859d8ad08b.json')
const databaseURL = 'https://fcm-b43c5.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-b43c5/messages:send'
const deviceToken =
  'codNdREz_sOX4B1yK_sTph:APA91bEo5TbxuE9AQwtLAHRQiiil-1jBhwJ2JrPoSxa63kYDgksAmSDMkFDvv5GxBJjx6UkRoK0Tr6oDXsD-onap9CwqLT8ek-enul4luVnJ5xEXOmZ1XJeiTmKlgNQI0T8zzUZYLuSH'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Kiartisak',
        body: 'Klomprakhon'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()