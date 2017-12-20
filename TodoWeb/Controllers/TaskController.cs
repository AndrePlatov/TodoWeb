using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using TodoWeb.Models;

namespace TodoWeb.Controllers
{
    [Authorize]
    public class TaskController : ApiController
    {

        //        Get Tasks(all incomplete)
        //      New Task
        //      Get Task Details
        //      Update Task Details
        //      Complete Task(set status to complete)
        //      Delete Task

        ITaskRepository _repository;

        public TaskController(ITaskRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IEnumerable<ToDoTask> Get([FromUri] bool includeCompleted = false)
        {
            return _repository.Get(includeCompleted);
        }
        
        [HttpPost]
        public ToDoTask Add(ToDoTask newTask)
        {
           return _repository.Add(newTask);
        }

        [HttpPatch]
        public void Update(ToDoTask modifiedTask)
        {
            _repository.Update(modifiedTask);
        }

        [Route("api/Task/ChangeStatus")]
        [HttpPatch]
        public void ChangeStatus(ToDoTask modifiedTask)
        {
            _repository.ChangeStatus(modifiedTask);
        }

        [HttpDelete]
        public void Delete([FromBody] int idForDeletion)
        {
            _repository.Delete(idForDeletion);
        }
    }
}