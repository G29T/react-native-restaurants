#import <React/RCTBridgeModule.h>

@interface AppVersion : NSObject <RCTBridgeModule>
@end

@implementation AppVersion

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(
    getVersion:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
) {
    NSString *version =
        [[NSBundle mainBundle]
            objectForInfoDictionaryKey:@"CFBundleShortVersionString"];

    resolve(version);
}

@end