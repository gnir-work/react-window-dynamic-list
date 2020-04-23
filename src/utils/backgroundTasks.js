const createBackgroundTaskProcessor = () => {
  const tasks = {};
  let taskInterval;
  const isProcessing = () => !!taskInterval;
  let isPaused = false;
  let callback;

  const start = () => {
    if (isProcessing()) {
      return;
    }
    taskInterval = setInterval(() => {
      const remainingTasks = Object.values(tasks).filter(Boolean);
      if (remainingTasks.length) {
        remainingTasks[0]();
      } else {
        stop();
      }
    }, 0);
  };

  const stop = () => {
    if(callback) {
      callback();
    }
    if (!isProcessing()) {
      return;
    }
    clearInterval(taskInterval);
    taskInterval = null;
  };

  const pause = () => {
    isPaused = true;
    stop();
  };

  const resume = () => {
    isPaused = false;
    start();
  };

  const add = ({ id, task }) => {
    if (task[id] || task === false) {
      return; // Task is already planned/running/done
    }
    tasks[id] = () => {
      task();
      tasks[id] = false; // Set task as done
    };
    if (!isProcessing() && !isPaused) {
      start();
    }
  };

  const remove = (id) => {
    delete tasks[id]; // Remove existing task if it exists
  };

  const replace = ({ id, task }) => {
    remove(id);
    add({ id, task });
  };

  const setCallback = cb => callback = cb;

  return { pause, resume, add, remove, replace, setCallback };
};

export default createBackgroundTaskProcessor;
