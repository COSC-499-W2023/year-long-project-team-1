import multiprocessing as mp, time, os

class ProcessTrackerObject():
    process: mp.Process
    """a variable indicating the actual multiprocessing Process object"""

    timestamp: float
    """a float indicating when this class object was instantiated"""

    expiry_period: float
    """a float representing the number of hours this process has before it can be pruned"""

    def __init__(self, process: mp.Process, expiry_period: float = 1):
        self.timestamp = time.time()    # number of seconds since unix epoch (jan 1 1970)
        self.process = process
        self.expiry_period = expiry_period

    def is_expired(self):
        """
        This function checks if this process has existed for longer than
        `self.expiry_period` number of hours
        """
        return (time.time() - self.timestamp) > (self.expiry_period * 3600)
    
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
    processes: 'dict[str, ProcessTrackerObject]' = {}
    """internal dict of `ProcessTrackerObject`s the ProcessTracker is keeping track of"""

    prune_interval: float
    """interval in seconds for how often `prune()` will be run"""

    is_running: bool
    """indicates if main() is running"""

    def __init__(self):
        self.prune_interval = float(os.environ["PRIVACYPAL_STATE_PRUNE_INTERVAL"])
        self.is_running = False

    def add(self, filename: str, p: ProcessTrackerObject):
        """
        Adds a `ProcessTrackerObject` to be tracked.
        """
        self.processes[filename] = p
    
    def prune(self):
        """
        Removes all expired `ProcessTrackerObject`s from the internal list.
        """
        for f in self.processes:
            p = self.processes[f]
            if p.is_expired():
                p.kill_process()
                self.processes.pop(f)

    def get_process(self, filename: str):
        """
        Searches for a ProcessTrackerObject that has a matching filename,
        returns the object or `None` if not found.
        """
        try:
            return self.processes[filename]
        except KeyError:
            return None

    def main(self):
        """
        Infinitely runs and prunes the list of tracked objects periodically.
        Should be run as a background task on a separate thread.
        """
        self.is_running = True
        while True:
            time.sleep(self.prune_interval)
            self.prune()
            print("ProcessTracker prune finished.")

