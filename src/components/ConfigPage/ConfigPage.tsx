import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@mui/material";

const ConfigPage = () => {
  const [data, setData] = useState({});
  const [submiting, setSubmiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  console.log(data)

  const handleSubmit = async () => {
    setSubmiting(true);
    setError('')
    setSuccessMessage('')

    try {
      const response = await axios.post('http://localhost:3000/config', { config: data }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message || 'Konfigurácia úspešne aktualizovaná.');
      } else {
        setError(response.data.error || 'Nepodarilo sa aktualizovať konfiguráciu.');
      }
    } catch (err) {
      console.error('Chyba pri odosielaní konfigurácie:', err);
      setError('Chyba pri komunikácii so serverom.');
    } finally {
      setSubmiting(false);
    }
  };

  const handlerSetCourseTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      course: {
        ...prevData.course,
        title: e.target.value,
      },
    }));
  };

  const handlerSetCourseAcronym = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      course: {
        ...prevData.course,
        acronym: e.target.value,
      },
    }));
  };

  const handleSetLinks = (e: React.ChangeEvent<HTMLInputElement>, idToChange: number, param: 'title' | 'url') => {
    setData(prevData => ({
      ...prevData,
      links: prevData.links.map((link, id) => {
        if (id === idToChange) {
          return {
            ...link, 
            [param]: e.target.value, 
          };
        }
        return link;
      }),
    }));
  };

  const handleSetPaths = (e: React.ChangeEvent<HTMLInputElement>, idToChange: number, param: 'title' | 'path' | 'type') => {
    setData(prevData => ({
      ...prevData,
      folders: prevData.folders.map((path, id) => {
        if (id === idToChange) {
          return {
            ...path, 
            [param]: e.target.value, 
          };
        }
        return path;
      }),
    }));
  };

  const handleAddLink = () => {
    setData(prevData => ({
      ...prevData,
      links: [
        ...prevData.links,
        { title: '', url: '' }
      ]
    }));
  }

  const handleAddPath = () => {
    setData(prevData => ({
      ...prevData,
      folders: [
        ...prevData.folders,
        { title: '', path: '', type: '' }
      ]
    }));
  }

  const handleAddLanguage = () => {
    setData(prevData => ({
      ...prevData,
      highlighting: {
        "extra-languages": [
          ...prevData.highlighting["extra-languages"].concat(['']),
        ]
      }
    }));
  }

  const handleAddTranslation = () => {
    setData(prevData => ({
      ...prevData,
      translations: {
        ...prevData.translations,
        languages: [
          ...prevData.translations.languages,
          '',
        ],
      },
    }));
  }

  const handleRemoveTranslation = (idToRemove: number) => {
    setData(prevData => ({
      ...prevData,
      translations: {
        ...prevData.translations,
        languages: [
          ...prevData.translations.languages.filter((link, id) => id !== idToRemove),
        ],
      },
    }));
  }

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLInputElement>, idToChange: number) => {
    setData(prevData => ({
      ...prevData,
      highlighting: {
        "extra-languages": [
          ...prevData.highlighting["extra-languages"].map((language, id) => {
            if (id === idToChange) {
              return e.target.value 
            }
            return language;
          }),
        ]
      }
    }));
  }

  const handleRemoveLink = (idToRemove: number) => {
    setData(prevData => ({
      ...prevData,
      links: [
        ...prevData.links.filter((link, id) => id !== idToRemove),
      ]
    }));
  }

  const handleRemoveLanguage = (idToRemove: number) => {
    setData(prevData => ({
      ...prevData,
      highlighting: {
        ...prevData.highlighting, 
        "extra-languages": prevData.highlighting["extra-languages"].filter((language: string, id: number) => id !== idToRemove),
      },
    }));
  }

  const handlerSetPublishedWeeks = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      "published-weeks": parseInt(e.target.value),
    }));
  };

  const handlerSetThemeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      theme: {
        ...prevData.theme,
        name: e.target.value,
      },
    }));
  };

  const handlerSetThemeFootNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      theme: {
        ...prevData.theme,
        footnote: e.target.value,
      },
    }));
  };


  const handlerSetDeployService = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      deploy: {
        ...prevData.deploy,
        service: e.target.value,
      },
    }));
  };

  const handlerSetDeployCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      deploy: {
        ...prevData.deploy,
        code: e.target.value,
      },
    }));
  };

  const handlerSetDeployLecturerCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      deploy: {
        ...prevData.deploy,
        "lecturer-credentials": e.target.value,
      },
    }));
  };

  const handlerSetAnalytics = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({
      ...prevData,
      "analytics-code": e.target.value
    }));
  }

  const handleRemovePath = (idToRemove: number) => {
    setData(prevData => ({
      ...prevData,
      folders: [
        ...prevData.folders.filter((link, id) => id !== idToRemove),
      ]
    }));
  }

  const handleSetTranslation = (e: React.ChangeEvent<HTMLInputElement>, param: 'translation' | 'fallback', idToChange: number | undefined) => {
    setData(prevData => ({
      ...prevData,
      translations: {
        fallback: param === 'fallback' ? e.target.value : prevData.translations.fallback,
        languages: prevData.translations.languages.map((language, id) => {
          if(id === idToChange){
            return e.target.value
          }
          return language
        })
      }
    }));
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const { data } = await axios.get('http://localhost:3000/config')
    setData(data.config)

  }

  return (
    <div className="p-4">
      <h2>Course</h2>
      <div className="flex flex-col"> 
        <input
          type="text"
          value={data?.course?.title || ''}
          onChange={handlerSetCourseTitle}
          placeholder="Course title"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />

        <input 
          type="text" 
          value={data?.course?.acronym || ''} 
          onChange={handlerSetCourseAcronym} 
          placeholder="Course Acronym"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
      
      <div className="flex items-center">
        <h2 className="mr-2">Links</h2>
        <FontAwesomeIcon icon={faPlusSquare} onClick={() => handleAddLink()} className="cursor-pointer" />
      </div>
      {
        data?.links?.map((link, id: number) => {
          return (
            <div key={id}>
              <input 
                type="text" 
                value={link.title} 
                onChange={(e) => handleSetLinks(e, id, 'title')} 
                placeholder="Title"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <input 
                type="text" 
                value={link.url} 
                onChange={(e) => handleSetLinks(e, id, 'url')} 
                placeholder="URL"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <FontAwesomeIcon icon={faMinusSquare} onClick={() => handleRemoveLink(id)} className="cursor-pointer"/>
            </div>
          )
        })
      }

      <h2>Published week</h2>
      <div className="flex flex-col">
        <input 
          type="number" 
          value={data?.["published-weeks"] || ''} 
          onChange={handlerSetPublishedWeeks} 
          placeholder="Published Weeks"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
      </div>
      
      <h2>Theme</h2>
      <div className="flex flex-col">
        <input 
          type="text" 
          value={data?.theme?.name || ''} 
          onChange={handlerSetThemeName} 
          placeholder="Theme name"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />

        <input 
          type="text" 
          value={data?.theme?.footnote || ''} 
          onChange={handlerSetThemeFootNote} 
          placeholder="Theme Footnote"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
      </div>

      <div className="flex items-center">
        <h2 className="mr-2">Translations</h2>
        <FontAwesomeIcon icon={faPlusSquare} onClick={() => handleAddTranslation()} className="cursor-pointer" />
      </div>
      <div className="flex">
        <div>
          {
            data?.translations?.languages.map((language: string, id: number) => {
              return (
                <div key={id}>
                  <input 
                    type="Language" 
                    value={language || ''} 
                    onChange={(e) => {handleSetTranslation(e, 'translation', id)}} 
                    placeholder="Language"
                    className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
                  />
                  <FontAwesomeIcon icon={faMinusSquare} onClick={() => handleRemoveTranslation(id)} className="cursor-pointer"/>
                </div>
              )
            })
          }
        </div>
        <div className="ml-2">
          <input 
            type="text" 
            value={data?.translations?.fallback || ''} 
            onChange={(e) => {handleSetTranslation(e, 'fallback')}} 
            placeholder="Fallback"
            className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
          />
        </div>
      </div>
      
      

      <div className="flex items-center">
        <h2 className="mr-2">Extra Languages</h2>
        <FontAwesomeIcon icon={faPlusSquare} onClick={() => handleAddLanguage()} className="cursor-pointer" />
      </div>
      {
        data?.highlighting?.["extra-languages"].map((language: string, id: number) => {
          return (
            <div key={id}>
              <input 
                type="text" 
                value={language || ''} 
                onChange={(e) => handleChangeLanguage(e, id)} 
                placeholder="Language"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <FontAwesomeIcon icon={faMinusSquare} onClick={() => handleRemoveLanguage(id)} className="cursor-pointer"/>
            </div>
          )
        })
      }

      <div className="flex items-center">
        <h2 className="mr-2">Paths</h2>
        <FontAwesomeIcon icon={faPlusSquare} onClick={() => handleAddPath()} className="cursor-pointer" />
      </div>
      {
        data?.folders?.map((folder, id: number) => {
          return (
            <div key={folder.id}>
              <input 
                type="text" 
                value={folder.title || ''} 
                onChange={(e) => handleSetPaths(e, id, 'title')} 
                placeholder="Title"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <input 
                type="text" 
                value={folder.path || ''} 
                onChange={(e) => handleSetPaths(e, id, 'path')} 
                placeholder="Path"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <input 
                type="text" 
                value={folder.type || ''} 
                onChange={(e) => handleSetPaths(e, id, 'type')} 
                placeholder="Type"
                className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"  
              />
              <FontAwesomeIcon icon={faMinusSquare} onClick={() => handleRemovePath(id)} className="cursor-pointer"/>
            </div>
          )
        })
      }

      <h2>Deploy</h2>
      <div className="flex flex-col">
        <input 
          type="text" 
          value={data?.deploy?.service} 
          onChange={handlerSetDeployService} 
          placeholder="Deploy Service"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
        <input 
          type="text" 
          value={data?.deploy?.code} 
          onChange={handlerSetDeployCode} 
          placeholder="Deploy Code"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
        <input 
          type="text" 
          value={data?.deploy?.["lecturer-credentials"] || ''} 
          onChange={handlerSetDeployLecturerCredentials} 
          placeholder="Deploy Lecturer Credentials"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
      </div>

      <h2>Analytics Code</h2>
      <div className="flex flex-col">
        <input 
          type="text" 
          value={data?.["analytics-code"] || ''} 
          onChange={handlerSetAnalytics} 
          placeholder="Analytics code"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"  
        />
      </div>
      <Button variant="contained" disabled={submiting} onClick={handleSubmit}>Submit</Button>
      <p>{error || successMessage}</p>
    </div>
  )
}

export default ConfigPage;