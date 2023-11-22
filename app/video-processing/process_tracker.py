import multiprocessing as mp, time

class ProcessTrackerObject():
    process: mp.Process
    """a variable indicating the actual multiprocessing Process object"""

    timestamp: float
    """a float indicating when this class object was instantiated"""

    expiry_period: float
    """a float representing the number of hours this process has before it can be pruned"""

    filename: str
    """a string representing the filename associated with the currently running video processing process"""

    def __init__(self, process: mp.Process, filename: str, expiry_period: float = 1):
        self.timestamp = time.time()    # number of seconds since unix epoch (jan 1 1970)
        self.process = process
        self.filename = filename
        self.expiry_period = expiry_period

    def is_expired(self):
        """
        This function checks if this process has existed for longer than
        `self.expiry_period` number of hours
        """
        if (time.time() - self.timestamp) > (self.expiry_period * 3600):
            return True
        return False
    
    def kill_process(self):
        """
        This function should be called when the ProcessTracker object is being pruned to kill
        the subprocess object contained within it or the process could be left dangling
        """
        if self.process.is_alive():
            self.process.kill()

    def process_is_alive(self):
        """
        This function returns the status of the process object, whether it is running or not
        """
        return self.process.is_alive()

class ProcessTracker():
    processes: 'list[ProcessTrackerObject]' = []
    """internal list of `ProcessTrackerObject`s the ProcessTracker is keeping track of"""

    prune_interval: float
    """interval in minutes for how often `prune()` will be run"""

    is_running: bool
    """indicates if main() is running"""

    def __init__(self, prune_interval: float = 1):
        self.prune_interval = prune_interval
        self.is_running = False

    def add(self, p: ProcessTrackerObject):
        """
        Adds a `ProcessTrackerObject` to be tracked.
        """
        self.processes.append(p)
    
    def prune(self):
        """
        Removes all expired `ProcessTrackerObject`s from the internal list.
        """
        for p in self.processes:
            if p.is_expired():
                p.kill_process()
                self.processes.remove(p)

    def get_process(self, filename: str):
        """
        Searches for a ProcessTrackerObject that has a matching filename,
        returns the object or `None` if not found.
        """
        out: ProcessTrackerObject = None
        for p in self.processes:
            if p.filename == filename:
                out = p
        return out

    def main(self):
        """
        Infinitely runs and prunes the list of tracked objects periodically.
        Should be run as a background task on a separate thread.
        """
        self.is_running = True
        while True:
            time.sleep(self.prune_interval * 60)
            self.prune()
            print("ProcessTracker prune finished.")

