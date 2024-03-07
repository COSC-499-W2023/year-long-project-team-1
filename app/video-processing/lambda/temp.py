import video_processor

vp = video_processor.VideoProcessor()
# x = vp.match_boxes([[0, 0, 10, 10], [20, 20, 10, 10]],
#                    [[40, 40, 10, 10], [3, 3, 10, 10], [17, 17, 10, 10]])

# x = vp.match_boxes([[0, 0, 10, 10], [20, 20, 10, 10]],
#                    [[2, 2, 10, 10], [17, 17, 10, 10]])
# print(x)

path = "/home/paul/Videos/two_faces_1.mp4"
path = "/home/paul/Videos/two_faces_2.mp4"
path = "/home/paul/Videos/test.mp4"
# path = "/home/paul/Videos/yes.mp4"

vp.process(path, "temp.mp4", [], True, 0.5, 1.3)
