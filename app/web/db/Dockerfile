FROM docker.io/library/node:18

ENV CONFIG_DIR=/opt/privacypal

RUN mkdir -p $CONFIG_DIR && chmod -R g=u $CONFIG_DIR

RUN adduser --system --ingroup root prisma

RUN npm install -g prisma@5.6.0

WORKDIR /app

COPY . .

USER prisma

ENTRYPOINT ["bash", "include/entrypoint.bash"]
