import React, { useState , useEffect } from "react";
import "./TweetBox.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import { Button } from "@material-ui/core";
import axios from 'axios';
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");
  const [fileImg, setFileImg] = useState(null);

  const sendFileToIPFS = async (e) => {
e.preventDefault();
    if (fileImg) {
        try {

            const formData = new FormData();
            formData.append("file", fileImg);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': "4f8c270963ba5d6c7f40",
                    'pinata_secret_api_key': "ce7a0816f8e96e90960155d8b699b1005a0bf9ce4d7b51c4d665b76de0464432",
                    "Content-Type": "multipart/form-data"
                },
            });

            const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
         console.log(ImgHash); 
//Take a look at your Pinata Pinned section, you will see a new file added to you list.   

        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
}

  const addTweet = async () => {
    let tweet = {
      'tweetText': tweetMessage,
      'isDeleted': false
    };

    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        )

        let twitterTx = await TwitterContract.addTweet(tweet.tweetText, tweet.isDeleted);

        console.log(twitterTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log("Error submitting new Tweet", error);
    }
  }

  const sendTweet = (e) => {
    e.preventDefault();

    addTweet();

    setTweetMessage("");
    setTweetImage("");
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);
console.log("ffff",fileImg)
  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...avatarOptions }
          />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>
        <input
          value={tweetImage}
          onChange={(e) => setTweetImage(e.target.value)}
          className="tweetBox__imageInput"
          placeholder="Optional: Enter image URL"
          type="text"
        />

        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
      <form onSubmit={sendFileToIPFS}>
<input type="file" onChange={(e) =>setFileImg(e.target.files[0])} required />
<button type='submit' >Mint NFT</button>            
</form>
<img src="https://gateway.pinata.cloud/ipfs/QmWfSz2caon2xzcsY1kPYWiY341CbZ8Zt3vE6DenhexHbd" />

    </div>
  );
}

export default TweetBox;
