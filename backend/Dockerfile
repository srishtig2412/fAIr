FROM tensorflow/tensorflow:2.9.2-gpu

RUN apt-get update && apt-get install -y python3-opencv
RUN add-apt-repository ppa:ubuntugis/ppa && apt-get update
RUN apt-get update
RUN apt-get install -y gdal-bin
RUN apt-get install -y libgdal-dev
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

#install numpy before gdal 
RUN pip install numpy==1.23.5

# pip install dependencies.
RUN pip install --global-option=build_ext --global-option="-I/usr/include/gdal" GDAL==`gdal-config --version`

COPY docker/ramp/docker-requirements.txt docker-requirements.txt
RUN pip install -r docker-requirements.txt

# pip install solaris -- try with tmp-free build
COPY docker/ramp/solaris /tmp/solaris
RUN pip install /tmp/solaris --use-feature=in-tree-build

RUN pip install scikit-fmm --use-feature=in-tree-build

RUN pip install setuptools --upgrade 

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN mkdir /app
WORKDIR /app
COPY . /app