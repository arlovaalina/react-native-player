//
//  Player.swift
//  Player
//
//  Created by Alina Orlova on 9/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import AVFoundation

@available(iOS 10.0, *)
@objc(Player)
class Player: RCTEventEmitter {
  
  var audioPlayer: AVPlayer?
  
  var observer: NSKeyValueObservation?
  
  var playingObserverToken: Any?
  
  @objc
  func initialize(_ url: String, callback: @escaping RCTResponseSenderBlock) {
    if let urlInstace = URL(string: url) {
      let asset = AVAsset(url: urlInstace)
      
      let assetKeys = [
        "playable",
        "duration"
      ]

      let playerItem = AVPlayerItem(
        asset: asset,
        automaticallyLoadedAssetKeys: assetKeys)
      
      // Register as an observer of the player item's status property
      self.observer = playerItem.observe(
        \.status,
        options:  [.new, .old],
        changeHandler: { (playerItem, change) in
          if playerItem.status == .readyToPlay {
            let duration = CMTimeGetSeconds(playerItem.duration)
            callback([["duration": duration]])
          }
      })
      
      let audioPlayer = AVPlayer(playerItem: playerItem)
      
      NotificationCenter.default.addObserver(self, selector: #selector(onPlayerItemDidPlayToEnd), name: .AVPlayerItemDidPlayToEndTime, object: nil)
      
      NotificationCenter.default.addObserver(self, selector: #selector(onPlayerItemTimeJumped), name: .AVPlayerItemTimeJumped, object: nil)
      
      self.playingObserverToken = audioPlayer.addPeriodicTimeObserver(
        forInterval: CMTime(seconds: 1, preferredTimescale: 2),
        queue: DispatchQueue.main
      ) { (progressTime) in
        let progress = CMTimeGetSeconds(progressTime)
        if (self.bridge != nil) {
          self.sendEvent(withName: "onTrackProgressChange", body: ["progress": progress])
        }
      }
      
      self.audioPlayer = audioPlayer
    }
  }
  
  deinit {
    if let observerToken = playingObserverToken {
      audioPlayer?.removeTimeObserver(observerToken)
      playingObserverToken = nil
    }
    NotificationCenter.default.removeObserver(self, name: .AVPlayerItemTimeJumped, object: nil)
    NotificationCenter.default.removeObserver(self, name: .AVPlayerItemDidPlayToEndTime, object: nil)
  }
  
  @objc
  func play() {
    audioPlayer?.play()
  }
  
  @objc
  func pause() {
    audioPlayer?.pause()
  }
  
  @objc
  func seekToTime(_ time: String) {
    if let timeDouble = Double(time) {
      audioPlayer?.seek(to: CMTime(seconds: timeDouble, preferredTimescale: 1))
    }
  }
  
  @objc
  func onPlayerItemDidPlayToEnd() {
    if (self.bridge != nil) {
      self.sendEvent(withName: "onTrackEnd", body: nil)
    }
  }
  
  @objc
  func onPlayerItemTimeJumped() {
    if (self.bridge != nil) {
      if let progressTime = audioPlayer?.currentTime() {
        let progress = CMTimeGetSeconds(progressTime)
        self.sendEvent(withName: "onTrackProgressChange", body: ["progress": progress])
      }
    }
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["onTrackProgressChange", "onTrackEnd"]
  }
}
