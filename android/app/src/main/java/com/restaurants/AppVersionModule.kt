package com.restaurants

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppVersionModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AppVersion"

    @ReactMethod
    fun getVersion(promise: Promise) {
        try {
        val version =
            reactContext.packageManager
            .getPackageInfo(reactContext.packageName, 0)
            .versionName

        promise.resolve(version)
        } catch (e: Exception) {
            promise.reject("VERSION_ERROR", e)
        }
    }
}