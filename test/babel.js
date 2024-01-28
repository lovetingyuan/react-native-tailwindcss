const babel = require('@babel/core')
const result = babel.transformSync(
  `
  import React from 'react'
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { INJECTED_JAVASCRIPT } from './inject-code'
import { RootStackParamList } from '../../types'
import { useStore } from '../../store'
import HeaderRight from './HeaderRight'
import useIsDark from '../../hooks/useIsDark'
import { UA } from '../../constants'
import { showToast } from '../../utils'

function Loading() {
  return (
    <View className="absolute w-full h-full justify-center items-center">
      <Image
        source={require('../../../assets/video-loading.png')}
        resizeMode="center"
        className="w-full"
      />
    </View>
  )
}

export default React.memo(function WebPage({ route, navigation }) {
  const { url, title } = route.params
  const webviewRef = React.useRef<WebView | null>(null)
  const { webViewMode } = useStore()
  const isDark = useIsDark()
  const [height, setHeight] = React.useState(Dimensions.get('screen').height)
  const [isEnabled, setEnabled] = React.useState(true)
  const [isRefreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    if (webviewRef.current) {
      setRefreshing(true)
      webviewRef.current.reload()
      setTimeout(() => {
        setRefreshing(false)
      }, 1000)
    }
  }, [])
  React.useEffect(() => {
    const headerRight = () => {
      return <HeaderRight reload={onRefresh} />
    }
    navigation.setOptions({
      headerRight,
    })
  }, [navigation, onRefresh])
  return (
    <ScrollView
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          enabled={isEnabled}
        />
      }
      className="flex-1 h-full">
      <WebView
        className="flex-1"
        style={{ height }}
        source={{ uri: url }}
        key={webViewMode}
        onScroll={e => setEnabled(e.nativeEvent.contentOffset.y === 0)}
        originWhitelist={['http://*', 'https://*', 'bilibili://*']}
        allowsFullscreenVideo
        injectedJavaScriptForMainFrameOnly
        allowsInlineMediaPlayback
        startInLoadingState
        pullToRefreshEnabled
        applicationNameForUserAgent={'BILIBILI/8.0.0'}
        // allowsBackForwardNavigationGestures
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        renderLoading={Loading}
        userAgent={webViewMode === 'MOBILE' ? '' : UA}
        ref={webviewRef}
        onMessage={evt => {
          const data = JSON.parse(evt.nativeEvent.data)
          if (data.action === 'set-title' && !title) {
            navigation.setOptions({
              headerTitle: data.payload,
            })
          }
        }}
        onLoad={() => {

        }}
        onError={() => {
          showToast('加载失败')
        }}
        onShouldStartLoadWithRequest={request => {
          if (request.url.startsWith('bilibili://')) {
            // Linking.openURL(request.url).catch(err => {
            //   __DEV__ && console.error(err)
            // })
            return false
          }
          if (request.url.includes('.apk')) {
            return false
          }
          return true
        }}
      />
    </ScrollView>
  )
})

`,
  {
    plugins: [require('../src/babel-plugin')],
    presets: ['babel-preset-expo'],
  }
)

console.log(result.code)
