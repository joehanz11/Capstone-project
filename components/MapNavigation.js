import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const style = require('../app/styles');
const GOOGLE_MAPS_APIKEY = 'AIzaSyConAxDh0koY2keMNnZqqepFETXsxWSguo';

const MapNavigation = (mapInformation) => {
  const [destination, setDestination] = useState(
    {
      longitude: parseFloat(mapInformation.destination?.lon),
      latitude: parseFloat(mapInformation.destination?.lat)
    }
  )
  const [origin, setOrigin] = useState(null);
  const logEta = (q) => {
    const eta = {
      distance: q?.distance ? q?.distance : 0,
      duration: q?.duration ? q?.duration : 0
    }
    if (typeof mapInformation?.etaInformation !== "undefined"   ) {
      mapInformation.etaInformation(eta);
    }
    
  }

  useEffect(() => {
    if(mapInformation.origin) {
      setOrigin(
        {
          longitude: parseFloat(mapInformation.origin.lon),
          latitude: parseFloat(mapInformation.origin.lat)
        }
      );
    }

    setDestination(
      {
        longitude: parseFloat(mapInformation.destination.lon),
        latitude: parseFloat(mapInformation.destination.lat)
      }
    );
  }, [mapInformation.origin, mapInformation.destination])

  
  return (
    <MapView
      style={style.is_flex}
      region={{
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }}
      mapType="mutedStandard"
    >

      {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            mode='DRIVING'
            strokeWidth={3}
            strokeColor='hotpink'
            onReady={(w) => logEta(w)}
            region='PH'
        />
      )}
      {origin && (
        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title='Origin'
          identifier='origin'
        />
      )}

      {destination && (

        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title='Destination'
          identifier='destination'
        />
      )}
    </MapView>
  )
}
export default MapNavigation