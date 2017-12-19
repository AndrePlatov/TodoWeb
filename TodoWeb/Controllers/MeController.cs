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

            //ObjectCache cache = MemoryCache.Default;
            //List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;

            //tasks = new List<ToDoTask>() { new ToDoTask { Id=0, Description = "", Name = "", Status = ToDoStatus.InComplete } };
            //// persist
            //cache["toDoTasks"] = tasks;
        }

        [HttpGet]
        public IEnumerable<ToDoTask> Get()
        {
            return _repository.Get();
        }

        [HttpGet]
        public ToDoTask Get(int id)
        {
            return _repository.GetById(id);
        }

        [HttpPost]
        public void Add(ToDoTask newTask)
        {
            _repository.Add(newTask);
        }

        [HttpPatch]
        public void Update(ToDoTask modifiedTask)
        {
            _repository.Update(modifiedTask);
        }

        [HttpPatch]
        public void Complete([FromUri] int idToComplete)
        {
            _repository.Complete(idToComplete);
        }

        [HttpDelete]
        public void Delete(int idForDeletion)
        {
            _repository.Delete(idForDeletion);
        }
    }
}