async function retrieveWord() {
    const response = await fetch("https://random-word-api.herokuapp.com/word"); // use fetch to fetch data from the apiURL, await waits for the response
    if(response.status === 404){ // if unable to fetch, display error message and hide the weather section div
        
    }
    else{ // else we are able to fetch so don't show the error message
        
    }
    var data = await response.json(); // store the fetched data
    console.log(data);
}

retrieveWord();