namespace MovieSearch.Data
{
    public class Paged<TEntity>
    {
        public Paged()
        {

        }

        public int Total { get; set; }

        public TEntity[]? Items { get; set; }

        public string? Exception { get; set; }
    }
}
