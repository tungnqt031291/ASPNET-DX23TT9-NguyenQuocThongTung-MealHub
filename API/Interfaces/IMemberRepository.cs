using mealhub.DTOs;
using mealhub.DTOs.Request;
using mealhub.Models;

namespace mealhub.Interfaces
{
    public interface IMemberRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<MemberDto>> SearchMembers(string query);

        Task<IEnumerable<RecipesDto>> GetUserRecipesAsync(string username);

        Task<IEnumerable<AppUser>> GetUsersAsync();


        Task<AppUser> GetUserByUserNameAsync(string username);

        Task<IEnumerable<MemberDto>> GetMembersAsync();

        Task<MemberDto> GetMemberByUserNameAsync(string username);
        
        Task<Photo> AddMemberPhotoAsync(IFormFile file);

        Task<bool> UpdateMemberAsync(MemberUpdateRequest memberDto, string username);

        Task<bool> DeleteMemberAsync(string username);
    }
}