const { default: axios } = require("axios");
const generateRandomString = require("../utils/generateRandomString");
var crypto = require('crypto');
const env = require("../configs/env.config");

class HereApiService {
    credFile = "./here/credentials.properties";
    token = null;
    hereApiClient = null;

    constructor(){
        this.hereApiClient = axios.create({
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        this.hereApiClient.interceptors.request.use(
            async config => {
                await this.getToken();
                
                // const keys = JSON.parse(value)
                config.headers = { 
                  'Authorization': `Bearer ${this.token}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
                return config;
            }
        )
        this.hereApiClient.interceptors.response.use(response => {
            return response;
        }, (error) => {
            console.log(error);
        });
    }

    /**
     * get coordinates from an address.
     * @param {string} address Valid address to search coordinates
     * @returns coordinates of address
     */
    async getCoords(address){
        const resp =  await this.hereApiClient.get("https://geocode.search.hereapi.com/v1/geocode",{
            params: {
                q: address
            }
        })

        return {
            address: resp.data.items[0].title,
            pos: resp.data.items[0].position,
        }
    }

    /**
     * get valid address based on query
     * @param {string} query address to query
     * @returns list of valid addresses
     */
    async getAddresses(query) {
        const resp = await this.hereApiClient.get("https://autosuggest.search.hereapi.com/v1/autosuggest",{
            params: {
                q: query,
                at: "0.7893,113.9213"
            }
        })
        // console.log(resp.data.items);
        return {
            addresses: resp.data.items.map((i) => {
                return i.title
            })
        }
    }

    async getToken(){
        const signatureParams = {
            oauth_consumer_key: env("HERE_ACCESS_KEY_ID"),
            oauth_nonce: generateRandomString(6),
            oauth_signature_method: "HMAC-SHA256",
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_version: "1.0"
        }
        let signature = this.createSignature(signatureParams);
        signatureParams.oauth_signature = signature

        const ordered = Object.fromEntries(Object.entries(signatureParams).sort());
        const oauthHeader = Object.entries(ordered).map(([key, value]) => `${key}="${encodeURIComponent(value)}"`).join(",")

        const tokenResponse = await axios.post("https://account.api.here.com/oauth2/token",{
            grant_type: "client_credentials",
        },{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "OAuth " + oauthHeader,
            }
        })

        this.token = tokenResponse.data.access_token;

        return tokenResponse.data
    }

    /**
     * Create signature string
     * @param {object} signatureParams
     * @returns {string} Signature String
     */
    createSignature(signatureParams){
        let signatureString = `grant_type=client_credentials&oauth_consumer_key=${signatureParams.oauth_consumer_key}&oauth_nonce=${signatureParams.oauth_nonce}&oauth_signature_method=HMAC-SHA256&oauth_timestamp=${signatureParams.oauth_timestamp}&oauth_version=1.0`
        let baseString = `POST&${encodeURIComponent(env("HERE_TOKEN_ENDPOINT_URL"))}&${encodeURIComponent(signatureString)}`
        // console.log(baseString);
        let signingKey = encodeURIComponent(env("HERE_ACCESS_KEY_SECRET")) + "&"
        let hash = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');
        return hash;
    }
} 

module.exports = new HereApiService();