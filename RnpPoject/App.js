/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Geolocation from 'react-native-geolocation-service';
import WebView from 'react-native-webview';
import { RNCamera } from 'react-native-camera';
import ExampleApp from './src/olTest'
// 이부분을 넣어 주는 이유는?
const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;

class App extends Component {
  //TODO Target vesrion 29 사진 저장이?

  // console.log(Platform, 11, React.Element)
  //if (hasLocationPermission) {
  // webView = null;

  constructor() {
    super();
    this.state = {
      info: null,
      isOpen: false,
      returnData: null
    };
    // event binding
    this.onWebViewMessage = this.onWebViewMessage.bind(this);

    let g1 = this.requestExternalStoragePermission()

    let g2 = this.requestUserGeoLocation().then((res)=>{
      console.log(res,'g2')
    })

    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        this.setState({
          info: position.coords
        });
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        showLocationDialog:true,
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 3600000}
    );

    // 위치 정보






  }

  requestUserGeoLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'My App Storage location1',
          message: 'My App needs access to your storage ' +
            'so you can save your photos',
        },
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'My App Storage location2',
          message: 'My App needs access to your storage ' +
            'so you can save your photos',
        },
      );

      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'My App Storage Permission',
          message: 'My App needs access to your storage ' +
            'so you can save your photos',
        },
      );

      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  }
  // WebView -> Rn
  handleDataReceived(msgData) {
    console.log('handleDataReceived')
    msgData.isSuccessfull = true;
    msgData.args = [[this.state.info.longitude, this.state.info.latitude]];
    console.log(msgData)
    //Rn -> webView
    this.webView.postMessage(JSON.stringify(msgData));

  }

  getUserLocation(msgData) {
    alert('getUserLocation')
    console.log('getUserLocation')
    msgData.isSuccessfull = true;
    msgData.args = [[this.state.info.longitude, this.state.info.latitude]];
    console.log(msgData)
    //Rn -> webView
    this.webView.postMessage(JSON.stringify(msgData));
  }


  handleOnClickCamera(msgData){
    alert('handleOnClickCamera')
    this.setState({
      isOpen:true,
      returnData: msgData
    })
  }

  // 통신할 event 등록
  onWebViewMessage(event) {

    alert('onWebViewMessage')
    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.warn(err);
      return;
    }
    console.log(msgData.targetFunc)
    switch (msgData.targetFunc) {
      case "handleDataReceived":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
        case "getUserLocation":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
        case "handleOnClickCamera":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
    }
  }

  componentDidMount(): void {

  }
  onClick= () =>{
    this.setState({
      isOpen:!this.state.isOpen
    })
  }


render() {

  return (
    <>
      <WebView
        // html={require('./src/build/index.html')}
        ref={webView => this.webView = webView}
        source={{
          // uri:'file:///android_asset/build/index.html'
          uri: 'http://192.168.0.106:3000/'
        }}
        // source={{html}}
        injectedJavaScript={injectedJavascript}
        // javaScriptEnabledr
        style={{marginTop: 20}}
        // originWhitelist={["*"]}
        geolocationEnabled={true}
        // scalesPageToFit={true}
        // onMessage = {this.onWebViewMessage()}
        onMessage={this.onWebViewMessage}
        // onMessage={this.onMessage }
      />

      <ExampleApp isOpen={this.state.isOpen} onClick={this.onClick} webView={this.webView} returnData={this.state.returnData
      }></ExampleApp>

    </>
  );
}
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
