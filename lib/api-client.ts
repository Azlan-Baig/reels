type FetchOptions = {
    method? : "GET" | "POST" | "PUT" |"DELETE"
    body? : any
    headers? : Record<string,string>
}

class ApiClient{
    private async Fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ){

    }
}