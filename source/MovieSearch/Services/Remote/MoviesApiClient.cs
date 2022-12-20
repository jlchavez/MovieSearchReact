using Microsoft.Extensions.Caching.Memory;
using MovieSearch.Data;
using System;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MovieSearch.Services.Remote
{
    public class MoviesStore : IMoviesStore
    {
        static MoviesStore()
        {
              _jsonOptions = new(() => new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });      
        }
        
        public MoviesStore(IMemoryCache memoryCache)
        {
            MemoryCache = memoryCache;
        }

        public IMemoryCache MemoryCache { get; }

        private static Lazy<JsonSerializerOptions> _jsonOptions;

        public async Task<Paged<Movie>?> GetAsync(string? name = null, int? page = 1)
        {
            var key = $"Movies:{name};{page}";
            if (MemoryCache.TryGetValue(key, out Paged<Movie> movies))
                return movies;

            var httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://jsonmock.hackerrank.com/api/movies/")
            };
            try
            {
                var response = await httpClient.GetAsync($"search/?Title={name}&page={page}");
                if (response.IsSuccessStatusCode)
                {
                    var moviesResult = JsonSerializer.Deserialize<MoviesResult>(await response.Content.ReadAsStringAsync(), _jsonOptions.Value);

                    var result = new Paged<Movie>
                    {
                        Total = moviesResult?.Total ?? 0,
                        Items = moviesResult?.Data?.Select(x => new Movie { Title = x.Title, Year = x.Year }).ToArray()
                    };
                    MemoryCache.Set(key, result);
                    return result;
                }
                else
                {
                    return new Paged<Movie>()
                    {
                        Exception = (await response.Content.ReadAsStringAsync() ?? response.ReasonPhrase ?? $"Http Error Code: {response.StatusCode}")
                    };
                }
            }
            catch (JsonException jsonException)
            {
                return new Paged<Movie>() { Exception = $"Invalid Json: {jsonException.Message }"};
            }
            catch (HttpRequestException requestException)
            {
                return new Paged<Movie>() { Exception = $"Request exception: {requestException.Message}" };
            }
            catch (InvalidOperationException requestException)
            {
                return new Paged<Movie>() { Exception = $"Invalid operation: {requestException.Message}" };
            }
            catch (TaskCanceledException taskCanceled)
            {
                return new Paged<Movie>() { Exception = $"Task Canceled: {taskCanceled.Message}" };
            }
            catch (Exception e)
            {
                return new Paged<Movie>() { Exception = $"Error: {e.Message}" };
            }
        }

        class MovieJS
        {
            public string? Title { get; set; }
            public int? Year { get; set; }
        }

        class MoviesResult
        {
            public int? Total { get; set; } = 0;
            public MovieJS[]? Data { get; set; } = null;
        }
    }
}
