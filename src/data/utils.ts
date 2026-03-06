import edjsHTML from 'editorjs-html';
import { staticTranslations } from './staticTranslation';

function getAPIPath() {
    return "https://api-collections.vercel.app/api/smmpanels.org/"
    return "http://localhost:4322/api/smmpanels.org/"
}

function getImageBasePath() {
    return "https://secureurl.github.io/cloud/smmpanels.org%20images/";
}

function formatDate(inputDate: string, timeRequired : boolean = false) {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const options2: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    if(timeRequired == true)
        return date.toLocaleDateString('en-US', options);
    else
        return date.toLocaleDateString('en-US', options2);
}

function getTags(){
    const tags = ["SMM Panels", "Instagram", "Instagram Followers", "Facebook", "Facebook Views", "Snapchat", "WhatsApp", "YouTube", "Likes"];
    if (tags.length < 4) { throw new Error("Array must have at least 4 elements"); } // Shuffle the array using Fisher-Yates algorithm 
    
    let shuffled = tags.slice(); // copy array 
    
    for (let i = shuffled.length - 1; i > 0; i--) 
    { 
        const j = Math.floor(Math.random() * (i + 1)); 
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    } 
    
    // Return the first 4 elements 
    return shuffled.slice(0, 4);
}

function getMinimumPayDepo(paymentOptions : any[]) {
  // Convert payDepo strings to numbers
  const numericValues = paymentOptions.map(option => {
    return parseFloat(option.payDepo.toString().replace('$', '').trim());
  });

  // Find the minimum value
  return Math.min(...numericValues);
}

function makeWordsClickable(html:string, words:string[], path : string = "services") {
    // Iterate through each word in the array
    words.forEach(word => {
      // Create a regular expression to find the word, ignoring case
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      
      // Replace each occurrence of the word with an anchor tag
      html = html.replace(regex, `<a href="/${path}/${word.toLowerCase()}">${word}</a>`);
    });
    
    return html;
}

const listParser = ({ data }: { data: any }) => {
    const type = data.style === 'ordered' ? 'ol' : 'ul';
    const items = data.items.map((item : any)=> `<li>${item.content}</li>`).join('');
    return `<${type}>${items}</${type}>`;
};

function JsonToHtml(JSONStringParameter : any) {
    const edjsParser = edjsHTML({ List: listParser });
    const html = edjsParser.parse(JSONStringParameter);
    return html
}

function getRatingStars(count : number) {
    let ratingStars = [];
    for (let index = 0; index < 5; index++) {
        if(index < count)
            ratingStars.push(`fas fa-star`);
        else
            ratingStars.push(`fa-regular fa-star`);
    }

    return ratingStars;
}

export function isAdminLoggedIn(param_cookie: any) {
    if (param_cookie == undefined || param_cookie == "")
        return false
    else
        return true;
}

export function removeHTMLTags(str: string) {
    // Regular expression to match HTML tags
    const regex = /<\/?[^>]+(>|$)/g;
    // Replace matched HTML tags with an empty string
    return str.replace(regex, "");
}

export function timeDifference(dateTime: string | Date): string {
    const inputTime = new Date(dateTime);
    const currentTime = new Date();

    const diffInMs = currentTime.getTime() - inputTime.getTime();
    const diffInMin = Math.floor(diffInMs / 1000 / 60);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 6) {
        return "NA";
    }

    if (diffInDays > 0) {
        return diffInDays === 1 ? "1 Day" : `${diffInDays} Days`;
    }

    if (diffInHours > 0) {
        const remainingMinutes = diffInMin % 60;
        return remainingMinutes > 0
            ? `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}, ${remainingMinutes} Min`
            : `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}`;
    }

    return `${diffInMin} Min`;
}

export function getRandomElements(arr :any[], count:number) {
    // Create a copy of the original array
    let shuffled = arr.slice();

    // Shuffle the copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the first 'count' elements
    return shuffled.slice(0, count);
}

export function optimizeImageUrl(url:string, height = 100, format = 'webp') {
    // Split the URL at the last slash to separate the base URL from the image identifier
    const baseUrl = url.substring(0, url.lastIndexOf('/'));
    const imageId = url.substring(url.lastIndexOf('/') + 1);
    
    // Construct the optimized URL
    const optimizedUrl = `${baseUrl}/transform/height=${height},format=${format}/${imageId}`;
    
    return optimizedUrl;
}

export function formatNumberShort(num:number) {
    // Check if the number is greater than 1000
  if (num > 1000) {
    // Format the number as "xxk+"
    return Math.floor(num / 1000) + "k+";
  } 
  // Return the original number if it's not greater than 1000
  return num.toString();
}

export function shuffleArray(array : any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function AIPrompt(command1 : string, originalData1 :string){
    try {
        let apiKey = import.meta.env.GPTKEYp1 + import.meta.env.GPTKEYp2;
        // console.log("received in API - " , data);
        
        const apiUrl = "https://api.openai.com/v1/chat/completions";

        //#region Translating Part 1
        const messages = [
            {
                role: "system",
                content: command1, // Instruction for the assistant
            },
        ];
        
        messages.push({ 
            role: "user",
            content: originalData1,
        });

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
            }),
        });

        // Check for errors in the response
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data1 = await response.json();
        return data1.choices[0].message.content.trim();
        //#endregion

    } catch (error) {
        console.log(error);
    }
}

export function isSame(APIService: string, platformSavedService: string) {
    if (APIService.toLowerCase().includes(platformSavedService.toLowerCase()))
        return true;
}

export function getStaticTranslation(word:string, lang:string) {
    let translations:any = staticTranslations;
    if (translations[lang] && translations[lang][word]) {
      return translations[lang][word];
    }
    return `Translation not found for "${word}" in "${lang}"`;
  }

export function getLanguage(shortLang: string){
    const langList = [
        "(EN) English",
        "(RU) Russian",
        "(ZH) Chinese",
        "(ES) Spanish",
        "(FR) French",
        "(PT) Portuguese",
        "(HI) Hindi",
        "(BN) Bengali",
        "(UR) Urdu",
        "(ID) Indonesian",
    ];

    for (let i = 0; i < langList.length; i++) {
        if(langList[i].includes(shortLang.toUpperCase()))
            return langList[i].split(" ")[1];
    }
}

export let mainData ={
    title : "SMMPanels.org 2",
};
// Example usage:
//   console.log(timeDifference('2024-07-01T10:00:00')); // Adjust the date and time as needed



export { getAPIPath, getImageBasePath, formatDate, getTags, getMinimumPayDepo, makeWordsClickable, JsonToHtml, getRatingStars }