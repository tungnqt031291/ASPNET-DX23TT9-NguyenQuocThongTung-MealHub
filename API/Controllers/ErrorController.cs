using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mealhub.Data;

namespace mealhub.Controllers
{
    public class ErrorResponse
    {
        public string Message { get; set; }
    }

    public class ValidationErrorResponse : ErrorResponse
    {
        public List<string> Errors { get; set; }
    }

    public class ErrorController : BaseApiController
    {
        private readonly DataContext _context;
        public ErrorController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "only you can see this!";
        }

        [HttpGet("not-found")]
        public ActionResult<string> GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("bad-request/{type}")]
        public ActionResult<string> GetBadRequest(string type = "simple")
        {
            if (type == "simple")
            {
                var errorResponse = new ErrorResponse
                {
                    Message = "This is a simple error message."
                };
                return BadRequest(errorResponse);
            }
            else if (type == "validation")
            {
                var validationErrorResponse = new ValidationErrorResponse
                {
                    Message = "This is a validation error message.",
                    Errors = new List<string> { "Error 1", "Error 2" }
                };
                return BadRequest(validationErrorResponse);
            }
            else
            {
                return BadRequest("Unknown error type.");
            }
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            return StatusCode(500, "Something went wrong");
        }
    }
}