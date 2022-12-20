using System;

namespace MovieSearch
{
    [Serializable]
    public class Movie
    {
        public Movie()
        {

        }

        public string? Title { get; set; }
        public int? Year { get; set; }
    }
}
