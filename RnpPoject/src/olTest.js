import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ToastAndroid, PermissionsAndroid,  Modal} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll'
import axios from 'axios'
import ImageEditor from '@react-native-community/image-editor';
import ImagePicker from 'react-native-image-crop-picker';
export default class ExampleApp extends PureComponent {
  constructor() {
    super();

  }

  render() {

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.isOpen}
      >
      <View style={styles.container}>

        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}


        />

        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.onClick()} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> close </Text>
          </TouchableOpacity>
        </View>

      </View>
      </Modal>

    );
  }
  requestExternalStoragePermission1 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'My App Storage Permission',
          message: 'My App needs access to your storage ' +
            'so you can save your photos',
        },
      );
      alert(1)
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  }

  checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        pauseAfterCapture:true,

      };

      const data = await this.camera.takePictureAsync(options)


      setTimeout(()=> this.camera.resumePreview(),3000)
      // alert('data get')
      // axios.get('http://192.168.0.106/upimg').then((response)=>{
      //   alert(response.data)
      // })
      console.log(data,'lsy')

      // console.log('아 좀ds',data.uri)
      if(data) {
        await this.checkAndroidPermission()
        CameraRoll.save(data.uri)

        ImagePicker.openCropper({
          path:data.uri,
          // width: 300,
          // height: 400,
          cropping: true,
          includeBase64: true
        }).then( (image) => {
          console.log(image);
          CameraRoll.save(image.path)
          axios.post('http://192.168.0.106/upimg',{
            imageName : 'test.jpg',
            imageData: image.data
          },{

            // headers: {
            //   'Accept' : 'application/josn',
            //   'Content-type': 'application/x-www-form-urlencoded',
            // },
          }).then((response)=>{

            console.log(response,this.props.returnData)
            const msgData = this.props.returnData
            msgData.isSuccessfull = true;
            msgData.args = [image.data];
            this.props.webView.postMessage(JSON.stringify(msgData))
            alert(response.data)
          }).catch(error=>{
            console.log(error)
          })
        });
        // CameraRoll.saveToCameraRoll(data.uri);
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
