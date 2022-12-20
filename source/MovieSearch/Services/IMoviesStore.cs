using MovieSearch.Data;
using System.Threading.Tasks;

namespace MovieSearch.Services
{
    public interface IMoviesStore
    {
        public Task<Paged<Movie>?> GetAsync(string? name = null, int? page = 1);
    }
}
