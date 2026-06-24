

namespace mealhub.DTOs
{
    public class MemberDto
    {
        public string UserName { get; set; }

        public string Alias { get; set; }

        public string Gender { get; set; }

        public string Description { get; set; }

        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        public DateOnly DateOfBirth { get; set; }

        public PhotoDto Photo { get; set; }

    }
}