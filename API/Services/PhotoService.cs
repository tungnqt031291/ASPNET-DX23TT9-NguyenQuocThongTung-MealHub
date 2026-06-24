using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using mealhub.Helpers;
using mealhub.Interfaces;

namespace mealhub.Services
{
    public class PhotoService : IPhotoService
    {

        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            Account account = new(
                            config.Value.CloudName,
                            config.Value.ApiKey,
                            config.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }
        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string folderName)
        {
            var uploadResults = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(600).Width(600).Crop("fill"),
                    Folder = folderName
                };
                uploadResults = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResults;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            return await _cloudinary.DestroyAsync(deleteParams);
        }
    }
}