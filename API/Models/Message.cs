
namespace mealhub.Models
{
    public class Message
    {
        public int MessageId { get; set; }

        public int SenderId { get; set; }

        public string SenderUsername { get; set; }

        public AppUser Sender { get; set; }

        public int ReceiverId { get; set; }

        public string ReceiverUsername { get; set; }

        public AppUser Receiver { get; set; }

        public string Content { get; set; }

        public DateTime? DateRead { get; set; }

        public DateTime DateSend { get; set; } = DateTime.UtcNow;

        public bool SenderDeleted { get; set; }

        public bool ReceiverDeleted { get; set; }

    }
}