using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using MovieSearch.Data;
using MovieSearch.Services;
using System.Threading.Tasks;

namespace MovieSearch
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        [HttpGet]
        public Task<Paged<Movie>?> GetAsync([FromServices] IMoviesStore moviesApi, string? name = null, int? page = 1)
        {
            return moviesApi.GetAsync(name, page);
        }
    }
}
